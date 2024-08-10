use actix_web::{post, web, HttpResponse, HttpRequest};
use sha2::{Sha512, Digest};
use validator::Validate;
use chrono::offset::Utc;
use chrono::DateTime;
use std::time::SystemTime;
use uuid::Uuid;
use bcrypt;
use hex;

// Custom crate imports (shit defined in main.rs basically, at top near the mod thing)
use crate::AppState;
use crate::structs::auth_request::AuthRequest;
use crate::structs::session_model::Session;
use crate::services::user_service::{get_by_username as db_get_by_username, create_user as db_create_user};
use crate::services::session_service::{created_user_session as db_create_user_session, remove_session as db_remove_session};

fn compute_sha512(input: &str) -> String {
    let mut hasher = Sha512::new();
    hasher.update(input.as_bytes());
    let hashed_string: Vec<u8> = hasher.finalize().into_iter().collect();
    return hex::encode(hashed_string);
}

#[post("/signin")]
pub async fn signin(app_state: web::Data<AppState>, req_body: web::Json<AuthRequest>) -> HttpResponse {
    // Read the body from the json, so we can borrow this for further processing
    let body_data = &req_body.into_inner();

    // Validate the incoming request body
    if let Err(e) = &body_data.validate() {
        // Return a bad request response if validation fails
        return HttpResponse::BadRequest().json(e);
    }
    
    // let serialized_body = serde_json::to_string(&req_body).unwrap();
    match db_get_by_username(&app_state.db_pool, &body_data.username).await {
        Ok(user) => {
            // Now that we have the user, we can check if the password matches using bcrypt
            if !bcrypt::verify(&body_data.password, &user.password).unwrap() {
                return HttpResponse::BadRequest().json("Invalid username or password");
            }
            // Password has been validated, lets make a session for them :D
            let session_token_raw = Uuid::new_v4().to_string(); // hash this, first time
            let session_token = compute_sha512(&session_token_raw);
            let system_time = SystemTime::now();
            let datetime: DateTime<Utc> = system_time.into();
            let created_at = datetime.format("%Y-%m-%d %T").to_string();
            // Compute the SHA-512 hash
            let hashed_hex = compute_sha512(&session_token);
            // Insert into DB to persist the session
            match db_create_user_session(&app_state.db_pool, &hashed_hex, &created_at, &user.username).await {
                Ok(_) => {
                    let user = Session {
                        session_token: session_token,
                        username: user.username,
                    };
                    return HttpResponse::Ok().json(user);
                },
                Err(e) => HttpResponse::BadRequest().json(e),
            }
        },
        Err(e) => HttpResponse::BadRequest().json(e),
    }
}

#[post("/signup")]
pub async fn signup(app_state: web::Data<AppState>, req_body: web::Json<AuthRequest>) -> HttpResponse {
    // Read the body from the json, so we can borrow this for further processing
    let body_data = &req_body.into_inner();

    // Validate the incoming request body
    if let Err(e) = &body_data.validate() {
        // Return a bad request response if validation fails
        return HttpResponse::BadRequest().json(e);
    }

    // Hash password using bcrypt :)
    let hashed_password = bcrypt::hash(&body_data.password, 12).unwrap();

    // let serialized_body = serde_json::to_string(&req_body).unwrap();
    match db_create_user(&app_state.db_pool, &body_data.username, &hashed_password).await {
        Ok(_) => {
            // Password is validated by default, this is a create. lets make a session for them :D
            let session_token_raw = Uuid::new_v4().to_string(); // hash this, first time
            let session_token = compute_sha512(&session_token_raw);
            let datetime: DateTime<Utc> = SystemTime::now().into();
            let created_at = datetime.format("%Y-%m-%d %T").to_string();
            // Compute the SHA-512 hash
            let hashed_hex = compute_sha512(&session_token);
            // Insert into DB to persist the session
            match db_create_user_session(&app_state.db_pool, &hashed_hex, &created_at, &body_data.username).await {
                Ok(_) => {
                    let user = Session {
                        session_token: session_token,
                        username: body_data.username.clone(),
                    };
                    return HttpResponse::Ok().json(user);
                },
                Err(e) => HttpResponse::BadRequest().json(e),
            }
        },
        Err(e) => HttpResponse::BadRequest().json(e),
    }
}

#[post("/signout")]
pub async fn signout(app_state: web::Data<AppState>, req:HttpRequest) -> HttpResponse {// Attempt to extract the Authorization header from the request
    if let Some(authorization_header) = req.headers().get("Authorization") {
        let authorization_value = authorization_header.to_str().unwrap_or_default();
        // Hash authorization_value, then pass into function
        let hashed_hex = compute_sha512(&authorization_value);

        match db_remove_session(&app_state.db_pool, &hashed_hex).await {
            Ok(_) => HttpResponse::NoContent().into(),
            Err(_) => HttpResponse::NoContent().into(),
        }
    } else {
        // Return an error response
        HttpResponse::BadRequest().body("Authorization header required.".to_string())
    }
}