use actix_web::{post, web, HttpResponse, Responder};
// Crate imports
use crate::AppState;
use crate::structs::auth_request::AuthRequest;
use crate::structs::signout_request::SignoutRequest;
use crate::services::auth_service::{signin as db_signin};

#[post("/signin")]
pub async fn signin(app_state: web::Data<AppState>, req_body: web::Json<AuthRequest>) -> HttpResponse {
    // let serialized_body = serde_json::to_string(&req_body).unwrap();
    match db_signin(&app_state.db_pool, &req_body.username).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::BadRequest().into(),
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