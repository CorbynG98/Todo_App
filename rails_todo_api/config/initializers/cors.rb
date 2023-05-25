Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '::1', '127.0.0.1', 'rails-todo.corbyngreenwood.com', '(http[s]{0,1}\/\/){0,1}rails\-todo\.corbyngreenwood\.com\/{0,1}'
      resource '/auth',
        headers: :any,
        methods: [:post, :options]
      resource '/todo',
        headers: :any,
        methods: [:get, :post, :delete, :options]
    end
  end