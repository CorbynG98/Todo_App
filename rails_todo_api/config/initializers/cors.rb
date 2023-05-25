Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '::1', '127.0.0.1', 'rails-todo.corbyngreenwood.com', /\A(http[s]{0,1}:\/\/){0,1}(rails\-todo\.corbyngreenwood\.com){1}(\/){0,1}\z/mi
      resource '/auth',
        headers: :any,
        methods: [:post, :options]
      resource '/todo',
        headers: :any,
        methods: [:get, :post, :delete, :options]
    end
  end