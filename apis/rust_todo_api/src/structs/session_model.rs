use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[derive(Clone)]
pub struct Session {
    pub username: String,
    pub session_token: String,
}