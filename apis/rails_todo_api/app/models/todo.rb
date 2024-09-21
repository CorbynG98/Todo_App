class Todo < ActiveRecord::Base
    self.table_name = 'Todo'  # Specify the table name explicitly
    
    validates :title, presence: true
    validates :user_id, presence: true

    def self.create_todo(title:, user_id:)
        todo = Todo.new(
            todo_id: SecureRandom.uuid,
            title: title,
            user_id: user_id,
            created_at: Time.now,
            completed: false
        )
        # Explicitly save the record
        if todo.save
          Rails.logger.info "Todo created with id #{todo.todo_id}"
          todo
        else
          Rails.logger.error "Failed to create todo: #{todo.errors.full_messages.join(', ')}"
          nil
        end
    end
end