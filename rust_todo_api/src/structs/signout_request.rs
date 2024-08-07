use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct SignoutRequest {
    pub session_id: String,
}