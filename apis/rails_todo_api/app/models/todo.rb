class Todo < ActiveRecord::Base
    attr_accessor :id, :title, :user_id, :completed, :created_at
    self.table_name = 'Todo'  # Specify the table name explicitly

    def initialize(id, todo = {})
        self.id = id
        self.title = todo[:title] unless todo.nil?
        self.user_id = todo[:user_id] unless todo.nil?
        self.completed = todo[:completed] unless todo.nil?
        self.created_at = todo[:created_at] unless todo.nil?
    end
end