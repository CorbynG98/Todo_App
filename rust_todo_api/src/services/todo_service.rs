use sqlx::mysql::MySqlPool;
use chrono::NaiveDateTime;
use crate::structs::todo_model::Todo;
use sqlx::Error;

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
        Err(e) => {
            println!("{}", e);
            Err("Failed to create todo")
        }
    }
}