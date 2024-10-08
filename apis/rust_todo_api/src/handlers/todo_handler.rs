use actix_web::{web, HttpResponse, Responder};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::time::SystemTime;
use validator::Validate;
// Custom crate imports 
use crate::AppState;
use crate::structs::session_model::Session;
use crate::services::todo_service::{
    get_todos as db_get_todos, 
    create_todo as db_create_todo,
    toggle_complete as db_toggle_complete, 
    clear_completed as db_clear_completed, 
    remove_todo as db_remove_todo
};
use crate::structs::todo_model::{Todo, TodoCreate};


pub async fn get_todos(app_state: web::Data<AppState>, session: Option<web::ReqData<Session>>) -> impl Responder {
    match db_get_todos(&app_state.db_pool, &session.unwrap().username).await {
        Ok(todos) => HttpResponse::Ok().json(todos),
        Err(_) => HttpResponse::InternalServerError().json("Failed to receive todos."),
    }
}

pub async fn create_todo(app_state: web::Data<AppState>, session: Option<web::ReqData<Session>>, req_body: web::Json<TodoCreate>) -> impl Responder {
    // Read the body from the json, so we can borrow this for further processing
    let body_data = &req_body.into_inner();

    // Validate the incoming request body
    if let Err(e) = &body_data.validate() {
        // Return a bad request response if validation fails
        return HttpResponse::BadRequest().json(e);
    }

    // Password has been validated, lets make a session for them :D
    let system_time = SystemTime::now();
    let datetime: DateTime<Utc> = system_time.into();
    let created_at = datetime.format("%Y-%m-%d %T").to_string();
    let todo_id = Uuid::new_v4().to_string();

    match db_create_todo(&app_state.db_pool, &todo_id, &created_at, &body_data.title, &session.unwrap().username).await {
        Ok(_) => {
            // Return the new todo, so the user ca see it
            let todo = Todo {
                id: todo_id,
                created_at: created_at,
                title: body_data.title.clone(),
                completed: false,
            }; 

            HttpResponse::Ok().json(todo)
        },
        Err(_) => HttpResponse::InternalServerError().json("Failed to create todo."),
    }
}

pub async fn toggle_complete(app_state: web::Data<AppState>, session: Option<web::ReqData<Session>>, todo_id: web::Path<String>) -> impl Responder {
    let id = todo_id.into_inner();

    match db_toggle_complete(&app_state.db_pool, &id, &session.unwrap().username).await {
        Ok(_) => {
            HttpResponse::NoContent().finish()
        },
        Err(_) => HttpResponse::InternalServerError().json("Failed to toggle todo copmletion status."),
    }
}

pub async fn clear_complete(app_state: web::Data<AppState>, session: Option<web::ReqData<Session>>) -> impl Responder {
    match db_clear_completed(&app_state.db_pool, &session.unwrap().username).await {
        Ok(_) => {
            HttpResponse::NoContent().finish()
        },
        Err(_) => HttpResponse::InternalServerError().json("Failed to clear completed todos."),
    }
}

pub async fn delete_todo(app_state: web::Data<AppState>, session: Option<web::ReqData<Session>>, todo_id: web::Path<String>) -> impl Responder {
    let id = todo_id.into_inner();

    match db_remove_todo(&app_state.db_pool, &id, &session.unwrap().username).await {
        Ok(_) => {
            HttpResponse::NoContent().finish()
        },
        Err(_) => HttpResponse::InternalServerError().json("Failed to delete todo."),
    }
}