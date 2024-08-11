use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
    HttpResponse,
    HttpMessage,
    web::Data,
    body::EitherBody
};
use futures_util::future::LocalBoxFuture;
use sha2::{Sha512, Digest};
use serde::{Deserialize, Serialize};
use futures::executor;
// Custom crate imports
use crate::services::session_service::{verify_session as db_verify_session};
use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseBody<T> {
    pub message: String,
    pub data: T,
}

impl<T> ResponseBody<T> {
    pub fn new(message: &str, data: T) -> ResponseBody<T> {
        ResponseBody {
            message: message.to_string(),
            data,
        }
    }
}

pub struct Auth;

fn compute_sha512(input: &str) -> String {
    let mut hasher = Sha512::new();
    hasher.update(input.as_bytes());
    let hashed_string: Vec<u8> = hasher.finalize().into_iter().collect();
    return hex::encode(hashed_string);
}

impl<S, B> Transform<S, ServiceRequest> for Auth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddleware { service }))
    }
}

pub struct AuthMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let binding = req.headers().clone();
        let auth_header = binding.get("Authorization").map(|v| v.to_str().unwrap_or_default());
        if auth_header.is_none() {
            let (request, _pl) = req.into_parts(); // Hvae to break this when we use it, otherwise it fucks everything else
            let response = HttpResponse::Unauthorized().json("Authorization header is required").map_into_right_body();
            return Box::pin(async { Ok(ServiceResponse::new(request, response)) });
        }

        // Make the variables we need for session verification function
        let hashed_hex = compute_sha512(&auth_header.unwrap());
        let app_state = req.app_data::<Data<AppState>>().unwrap();
        // Do the DB stuff, synchronously
        match executor::block_on(db_verify_session(&app_state.db_pool, &hashed_hex)) {
            Ok(user_id) => {
                req.extensions_mut().insert(user_id);
                let fut = self.service.call(req);
                Box::pin(async move {
                    fut.await.map(ServiceResponse::map_into_left_body)
                })
            },
            Err(_) => {
                let (request, _pl) = req.into_parts(); // Hvae to break this when we use it, otherwise it fucks everything else
                let response = HttpResponse::Unauthorized().json("Invalid auth token").map_into_right_body();
                return Box::pin(async { Ok(ServiceResponse::new(request, response)) });
            }
        }
    }
}