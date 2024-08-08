use sqlx::mysql::MySqlPool;
// Crate imports
use crate::structs::user_model::User;

pub async fn get_by_username(db_pool: &MySqlPool, username: &str) -> Result<User, &'static str> {
    match sqlx::query_as!(
        User,
        "SELECT username, password FROM User WHERE username = ?",
        username as &str
    )
    .fetch_one(db_pool).await {
        Ok(user) => Ok(user),
        Err(_) => Err("User not found"),
    }
}