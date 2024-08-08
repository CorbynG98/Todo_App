use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Session {
    pub session_token: String,
    pub username: String,
}