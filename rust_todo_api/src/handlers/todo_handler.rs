use actix_web::{HttpResponse, Responder};

pub async fn get_todos() -> impl Responder {
    return  HttpResponse::Ok().json("Request received to get todos!")
}

pub async fn create_todo() -> impl Responder {
    return  HttpResponse::Ok().json("Request received to create a todo!")
}

pub async fn toggle_complete() -> impl Responder {
    return  HttpResponse::Ok().json("Request received to toggle a todo complete status!")
}

pub async fn clear_complete() -> impl Responder {
    return  HttpResponse::Ok().json("Request received to clear all completed todos!")
}

pub async fn delete_todo() -> impl Responder {
    return  HttpResponse::Ok().json("Request received to delete a todo")
}