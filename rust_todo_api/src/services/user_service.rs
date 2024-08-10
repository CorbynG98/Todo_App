use sqlx::mysql::MySqlPool;
use regex::Regex;
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

pub async fn create_user(db_pool: &MySqlPool, username: &str, password: &str) -> Result<(), &'static str> {
    match sqlx::query!(
        "INSERT INTO User (username, password) VALUES (?, ?);",
        username as &str,
        password as &str
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(e) => {
            let duplicate_pattern = r"duplicate\s+entry\s+('?.*?')\s+for\s+key\s+('user\.primary')";
            let duplicate_re = Regex::new(duplicate_pattern).unwrap();
            if duplicate_re.is_match(&e.to_string().to_lowercase()) {
                return Err("User already exists");
            } else {
                return Err("Failed to create user");
            }
        },
    }
}