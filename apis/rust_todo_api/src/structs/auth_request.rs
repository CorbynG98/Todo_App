use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Serialize, Validate)]
pub struct AuthRequest {
    #[validate(length(min = 3, max = 50, message = "Username must be between 3 and 50 characters long"))]
    pub username: String,
    #[validate(length(min = 8, max = 150, message = "Password must be longer than 8 characters"))] // Generally max isn't good for passwords, but this is good for safety
    pub password: String,
}