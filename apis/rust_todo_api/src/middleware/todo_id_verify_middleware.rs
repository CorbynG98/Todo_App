use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
    HttpResponse,
    web::Data,
    body::EitherBody
};
use futures_util::future::LocalBoxFuture;
use serde::{Deserialize, Serialize};
use futures::executor;
// Custom crate imports
use crate::services::todo_service::{get_todo_by_id as db_get_todo_by_id};
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

pub struct TodoId;

impl<S, B> Transform<S, ServiceRequest> for TodoId
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = TodoIdMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(TodoIdMiddleware { service }))
    }
}

pub struct TodoIdMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for TodoIdMiddleware<S>
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
        let todo_id: String = req.match_info().query("todo_id").to_string();

        // Make the variables we need for session verification function
        let app_state = req.app_data::<Data<AppState>>().unwrap();
        // Do the DB stuff, synchronously
        match executor::block_on(db_get_todo_by_id(&app_state.db_pool, &todo_id)) {
            Ok(_) => {
                let fut = self.service.call(req);
                Box::pin(async move {
                    fut.await.map(ServiceResponse::map_into_left_body)
                })
            },
            Err(_) => {
                let (request, _pl) = req.into_parts(); // Hvae to break this when we use it, otherwise it fucks everything else
                let response = HttpResponse::Unauthorized().json("Invalid todo id").map_into_right_body();
                return Box::pin(async { Ok(ServiceResponse::new(request, response)) });
            }
        }
    }
}