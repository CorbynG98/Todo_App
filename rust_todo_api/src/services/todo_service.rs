use sqlx::mysql::MySqlPool;
use chrono::NaiveDateTime;
use crate::structs::todo_model::Todo;
use sqlx::Error;

pub async fn get_todo_by_id(db_pool: &MySqlPool, todo_id: &str) -> Result<Todo, Error> {
    let row = sqlx::query!(
        "SELECT todo_id as id, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%S') as created_at, title, completed FROM Todo WHERE todo_id = ?;",
        todo_id
    )
    .fetch_one(db_pool)
    .await?;

    // Since we're expecting exactly one row, we can directly access the fields
    let created_at = NaiveDateTime::parse_from_str(&row.created_at.unwrap(), "%Y-%m-%d %H:%M:%S")
        .expect("Failed to parse datetime");

    let todo = Todo {
        id: row.id,
        created_at: created_at.to_string(),
        title: row.title,
        completed: if row.completed == 0 { false } else { true },
    };

    Ok(todo)
}

pub async fn get_todos(db_pool: &MySqlPool, username: &str) -> Result<Vec<Todo>, Error> {
    let rows = sqlx::query!(
        "SELECT todo_id as id, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%S') as created_at, title, completed FROM Todo WHERE user_id = ?;",
        username
    )
    .fetch_all(db_pool)
    .await?;

    let todos: Vec<Todo> = rows.into_iter().map(|row| {
        let created_at = NaiveDateTime::parse_from_str(&row.created_at.unwrap(), "%Y-%m-%d %H:%M:%S")
            .expect("Failed to parse datetime");
        Todo {
            id: row.id,
            created_at: created_at.to_string(),
            title: row.title,
            completed: if row.completed == 0 { false } else { true },
        }
    }).collect();

    Ok(todos)
}

pub async fn create_todo(db_pool: &MySqlPool, todo_id: &str, created_at: &str, title: &str, username: &str ) -> Result<(), &'static str> {
    match sqlx::query!(
        "INSERT INTO Todo (todo_id, created_at, title, user_id) VALUES (?, ?, ?, ?);",
        todo_id as &str,
        created_at as &str,
        title as &str,
        username as &str
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to create todo")
    }
}

pub async fn remove_todo(db_pool: &MySqlPool, todo_id: &str, username: &str ) -> Result<(), &'static str> {
    match sqlx::query!(
        "DELETE FROM Todo WHERE todo_id = ? AND user_id = ?;",
        todo_id as &str,
        username as &str,
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to remove todo")
    }
}

pub async fn toggle_complete(db_pool: &MySqlPool, todo_id: &str, username: &str ) -> Result<(), &'static str> {
    match sqlx::query!(
        "UPDATE Todo SET completed = !completed WHERE todo_id = ? AND user_id = ?;",
        todo_id as &str,
        username as &str,
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to toggle todo completion status")
    }
}

pub async fn clear_completed(db_pool: &MySqlPool, username: &str ) -> Result<(), &'static str> {
    match sqlx::query!(
        "DELETE FROM Todo WHERE completed = 1 AND user_id = ?;",
        username as &str,
    )
    .execute(db_pool).await {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to clear completed todos")
    }
}