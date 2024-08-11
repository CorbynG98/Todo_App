use sqlx::mysql::MySqlPool;
use crate::structs::user_model::UserId;

pub async fn created_user_session(db_pool: &MySqlPool, session_token: &str, created_at: &str, username: &str) -> Result<(), &'static str> {
    match sqlx::query!(
        "INSERT INTO Session (session_token, created_at, user_id) VALUES (?, ?, ?)",
        session_token as &str,
        created_at as &str,
        username as &str
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(_) => {
            Err("Failed to create session")
        },
    }
}

pub async fn remove_session(db_pool: &MySqlPool, hashed_session: &str) -> Result<(), &'static str> {
    match sqlx::query!(
        "DELETE FROM Session WHERE session_token = ?;",
        hashed_session as &str,
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(_) => Ok(()), // We don't care if the session doesn't exist, succeed anyway
    }
}

pub async fn verify_session(db_pool: &MySqlPool, hashed_session: &str) -> Result<UserId, &'static str> {
    match sqlx::query_as!(
        UserId,
        "SELECT user_id FROM Session WHERE session_token = ?",
        hashed_session
    )
    .fetch_one(db_pool).await {
        Ok(row) => Ok(row),
        Err(_) => Err("Invalid session token"),
    }
}