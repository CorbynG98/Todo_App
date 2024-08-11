use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct User {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
#[derive(Clone)]
pub struct UserId {
    pub user_id: String,
}