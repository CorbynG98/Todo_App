Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*'
      resource '/auth',
        headers: :any,
        methods: [:post, :options]
      resource '/todo',
        headers: :any,
        methods: [:get, :post, :delete, :options]
    end
  end