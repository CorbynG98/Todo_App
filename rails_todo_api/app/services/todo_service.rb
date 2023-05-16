require 'google/cloud/firestore'

class TodoService
    def initialize
        @firestore = Google::Cloud::Firestore.new project_id: 'rails-todo-app-386721',
            keyfile: '/mnt/c/git/Rails Todo/Keys/rails-todo-app-386721-9768c0fe3836.json'
    end

    def get_todos(user_id)
        all = []
        todos_ref = @firestore.col("Todo").where("user_id", "=", user_id).order(:created_at, :asc)

        todos_ref.get do |todo_ref|
            all << Todo.new(todo_ref.document_id, todo_ref.data)
        end
        return all
    end

    def save_todo(_title, _user_id)
        result = @firestore.col("Todo").add({
            title: _title,
            user_id: _user_id,
            created_at: Time.now,
            completed: false
        })

        new_todo = Todo.new(result.document_id, {title: _title, user_id: _user_id, created_at: Time.now, completed: false})
        return new_todo
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
end