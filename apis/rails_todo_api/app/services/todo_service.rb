require 'google/cloud/firestore'
require 'active_record'
require 'securerandom'
require_relative '../models/dto/todo_dto'

class TodoService
    attr_accessor :all

    def initialize
        puts "TodoService initialize"
        begin
            db_config = YAML.load_file(File.expand_path('../../config/database.yml', __dir__), aliases: true)['default']
            ActiveRecord::Base.establish_connection(db_config)
        rescue => e
            puts "Error in initialize: #{e.message}"
        end
    end

    def get_todos(user_id)
        todos = Todo.where(user_id: user_id).order(created_at: :asc).all
        todos.empty? ? [] : todos
    end

    def save_todo(title, user_id)
        begin
            todo = Todo.create_todo(title: title, user_id: user_id)
            todo_dto = TodoDto.new(todo_id: todo.todo_id, todo: {
                title: todo.title,
                completed: todo.completed,
                created_at: todo.created_at
            })
            return todo_dto if todo&.persisted?
            nil
        rescue ActiveRecord::RecordInvalid => e
            Rails.logger.error "Failed to create new todo: #{e}"
            "Failed to create the new todo"
        end
    end

    def toggle_complete(_id, _user_id)
        todo_ref = @firestore.col("Todo").doc(_id)
        # Check if this todo item belongs to the user
        todo = todo_ref.get
        if todo.exists? == false then return false 
        elsif todo.data[:user_id] != _user_id then return false end
        # Update it if other checks passed
        todo_ref.update({completed: !todo.data[:completed]})
        return true
    end

    def remove(_id, _user_id)
        todo_ref = @firestore.col("Todo").doc(_id)
        # Check if this todo item belongs to the user
        todo = todo_ref.get
        if todo.exists? == false then return false
        elsif todo.data[:user_id] != _user_id then return false end
        # Delete it if other checks passed
        todo_ref.delete
        return true
    end

    def clear_completed(_user_id)
        todos_ref = @firestore.col("Todo").where("user_id", "=", _user_id).where("completed", "=", true).order(:created_at, :asc)
        # Loop through and delete all
        todos_ref.get do |todo_ref|
            todo_solo_ref = @firestore.col("Todo").doc(todo_ref.document_id)
            todo_solo_ref.delete
        end

        return true
    end
end