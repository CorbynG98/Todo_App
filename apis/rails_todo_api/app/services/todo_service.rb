require 'google/cloud/firestore'

class TodoService
    def initialize
        file_path = File.expand_path('../resources/appsettings.json', File.dirname(__FILE__))
        file = File.read(file_path)
        data_hash = JSON.parse(file)

        @firestore = Google::Cloud::Firestore.new project_id: data_hash["GCP"]["ProjectId"],
            keyfile: Rails.application.credentials.keyfile # Hoping this stays as nil if no keyfile found. We only need this when running locally.
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