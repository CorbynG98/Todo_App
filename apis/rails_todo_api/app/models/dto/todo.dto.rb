class TodoDto
    attr_accessor :id, :title, :completed, :created_at

    def initialize(todo_id:, todo:)
        self.id = todo_id
        self.title = todo[:title] unless todo.nil?
        self.completed = todo[:completed] unless todo.nil?
        self.created_at = todo[:created_at] unless todo.nil?
    end
end