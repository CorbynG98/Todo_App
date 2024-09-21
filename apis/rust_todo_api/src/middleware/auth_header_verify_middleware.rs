use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
    HttpResponse,
    body::EitherBody
};
use futures_util::future::LocalBoxFuture;
use serde::{Deserialize, Serialize};

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

pub struct AuthHeader;

impl<S, B> Transform<S, ServiceRequest> for AuthHeader
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthHeaderMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthHeaderMiddleware { service }))
    }
}

pub struct AuthHeaderMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthHeaderMiddleware<S>
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
        
        let fut = self.service.call(req);
        Box::pin(async move {
            fut.await.map(ServiceResponse::map_into_left_body)
        })
    }
}