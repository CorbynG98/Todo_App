use actix_web::{post, web, HttpResponse, Responder};
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
use crate::structs::signout_request::SignoutRequest;
use crate::services::user_service::{get_by_username as db_get_by_username};
use crate::services::session_service::{created_user_session as db_create_user_session};

#[post("/signin")]
pub async fn signin(app_state: web::Data<AppState>, req_body: web::Json<AuthRequest>) -> HttpResponse {
    println!("Seeing if we reach this lol");
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
            let session_token = Uuid::new_v4().to_string();
            let system_time = SystemTime::now();
            let datetime: DateTime<Utc> = system_time.into();
            let created_at = datetime.format("%Y-%m-%d %T").to_string();
            // Compute the SHA-512 hash
            let mut hasher = Sha512::new();
            hasher.update(session_token.as_bytes());
            let hashed_session_token: Vec<u8> = hasher.finalize().into_iter().collect();
            let hashed_hex = hex::encode(hashed_session_token);
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
pub async fn signup(req_body: web::Json<AuthRequest>) -> impl Responder {
    let serialized_body = serde_json::to_string(&req_body).unwrap();
    HttpResponse::Ok().body(format!("Signup route received: {:?}", serialized_body))
}

#[post("/signout")]
pub async fn signout(req_body: web::Json<SignoutRequest>) -> impl Responder {
    let serialized_body = serde_json::to_string(&req_body).unwrap();
    HttpResponse::Ok().body(format!("Signout route received: {:?}", serialized_body))
}