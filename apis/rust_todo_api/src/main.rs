mod handlers { // Declare the handlers module
    pub mod user_handler;
    pub mod todo_handler;
}
mod structs { // Declare the structs module
    pub mod auth_request;
    pub mod user_model;
    pub mod session_model;
    pub mod todo_model;
}
mod services { // Declare the persistence module
    pub mod user_service;
    pub mod session_service;
    pub mod todo_service;
}
mod middleware { // Declare the middleware module
    pub mod auth_middleware;
    pub mod auth_header_verify_middleware;
    pub mod todo_id_verify_middleware;
}
mod utils { // Declare the utils module
    pub mod hash_utils;
}

use actix_web::{http, web, App, HttpServer};
use handlers::user_handler::{signin, signup, signout}; // Auth endpoint code
use handlers::todo_handler::{get_todos, create_todo, toggle_complete, clear_complete, delete_todo}; // Todo endpoint code
use dotenv::dotenv;
use sqlx::mysql::{MySqlPool, MySqlPoolOptions};
use actix_cors::Cors;
use crate::middleware::auth_middleware::Auth;
use crate::middleware::auth_header_verify_middleware::AuthHeader;
use crate::middleware::todo_id_verify_middleware::TodoId;

#[derive(Clone)]
struct AppState {
    db_pool: MySqlPool
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Configure host and port for the server
    let host = "0.0.0.0";
    let port = 5002;
    println!("Starting server at http://{}:{}", host, port);

    // Load the .env file
    dotenv().ok();
    // Configure DB so we can use it throughout the app
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    println!("Connecting to the database...");
    let db_pool: MySqlPool = MySqlPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .unwrap();
    println!("Database connected!");
    println!("Configuring app_state and the HttpServer");
    // Create the app state
    let app_state = AppState { db_pool };
    // Start the server
    println!("API ready to receive requests!");
    let result = HttpServer::new(move || {
        // CORS configuration
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST", "DELETE"])
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::CONTENT_TYPE,
                http::header::ACCEPT,
            ])
            .max_age(3600);
        // App configuration
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(app_state.clone())) // Pass the DB pool to the app
            .service(
                web::scope("/v1/auth")
                    .route("/signin", web::post().to(signin))
                    .route("/signup", web::post().to(signup))
                    .route("/signout", web::post().to(signout).wrap(AuthHeader))
            )
            .service(
                web::scope("/v1/todo")
                    .wrap(Auth) // Verify the session is actually valid
                    .wrap(AuthHeader) // Verify the auth header has been provided (reverse order, so this is done first)
                    .route("", web::get().to(get_todos))
                    .route("", web::post().to(create_todo))
                    .route("{todo_id}", web::delete().to(delete_todo).wrap(TodoId))
                    .route("{todo_id}/togglecomplete", web::post().to(toggle_complete).wrap(TodoId))
                    .route("/clearcompleted", web::post().to(clear_complete))
            )
    })
    .bind((host, port)).expect("Failed to bind to port")
    .run()
    .await;

    match result {
        Ok(_) => println!("Server shut down gracefully"),
        Err(e) => eprintln!("Server error: {:?}", e),
    }

    Ok(())
}
