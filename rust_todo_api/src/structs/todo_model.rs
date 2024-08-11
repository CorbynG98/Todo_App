use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Serialize, Validate)]
pub struct TodoCreate {
    #[validate(length(min = 1, max = 100, message = "Todo needs to have a title... Less than 100 characters though :D"))]
    pub title: String,
}

#[derive(Deserialize, Serialize, Validate)]
pub struct Todo {
    pub id: String,
    pub created_at: String,
    pub title: String,
    pub completed: bool,
}