mod handlers { // Declare the handlers module
    pub mod user_handler;
}
mod structs { // Declare the structs module
    pub mod auth_request;
    pub mod signout_request;
    pub mod user_model;
    pub mod session_model;
}
mod services { // Declare the persistence module
    pub mod user_service;
    pub mod session_service;
}

use actix_web::{web, App, HttpServer};
use handlers::user_handler::{signin, signup, signout}; // Auth endpoint code
use dotenv::dotenv;
use sqlx::mysql::{MySqlPool, MySqlPoolOptions};

#[derive(Clone)]
struct AppState {
    db_pool: MySqlPool
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Configure host and port for the server
    let host = "0.0.0.0";
    let port = 5001;

    // Load the .env file
    dotenv().ok();
    // Configure DB so we can use it throughout the app
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    println!("Connecting to the database");
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
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone())) // Pass the DB pool to the app
            .service(
                web::scope("/auth")
                    .service(signin)
                    .service(signup)
                    .service(signout)
            )
    })
    .bind((host, port))?
    .run()
    .await
}