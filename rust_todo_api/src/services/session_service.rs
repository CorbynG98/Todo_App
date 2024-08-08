use sqlx::mysql::MySqlPool;

pub async fn created_user_session(db_pool: &MySqlPool, session_token: &str, created_at: &str, username: &str) -> Result<(), &'static str> {
    match sqlx::query!(
        "INSERT INTO Session (session_token, created_at, user_id) VALUES (?, ?, ?)",
        session_token as &str,
        created_at as &str,
        username as &str
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(e) => {
            // Print e to console
            println!("{:?}", e);
            Err("Failed to create session")
        },
    }
}