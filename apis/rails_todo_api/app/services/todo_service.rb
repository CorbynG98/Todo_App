require 'google/cloud/firestore'
require 'active_record'
require 'securerandom'
require_relative '../models/dto/todo_dto'

class TodoService
    attr_accessor :all

    def get_todos(user_id)
        begin
            todos = Todo.where(user_id: user_id).order(created_at: :asc).all
            todos.empty? ? [] : todos
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to get todos"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to get todos"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end

    def save_todo(title, user_id)
        begin
            todo = Todo.create_todo(title: title, user_id: user_id)
            todo_dto = Dto::TodoDto.new(todo_id: todo.todo_id, todo: {
                title: todo.title,
                completed: todo.completed,
                created_at: todo.created_at
            })
            return todo_dto if todo&.persisted?
            nil
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to create todo"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to create todo"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end

    def toggle_complete(_id, _user_id)
        begin
            todo = Todo.find_by(todo_id: _id)
            return false if todo.nil? || todo.user_id != _user_id
            
            todo.update(completed: !todo.completed)
            return true
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to create todo"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to create todo"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end

    def clear_completed(_user_id)
        begin
            todos = Todo.where(user_id: _user_id, completed: true).order(created_at: :asc)
            
            todos.each(&:destroy)
            return true
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to clear complete todos"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to clear complete todos"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end

    def remove(_id, _user_id)
        begin
            todo = Todo.find_by(todo_id: _id)
            return false if todo.nil? || todo.user_id != _user_id
            
            todo.destroy
            return true
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to remove todo"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to remove todo"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end
end