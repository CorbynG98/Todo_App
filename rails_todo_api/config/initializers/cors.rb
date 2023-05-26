Rails.application.config.middleware.insert_before 0, Rack::Cors do
    # allow do
    #   origins ['127.0.0.1', '::1', /\A(http[s]{0,1}:\/\/){0,1}(rails\-todo\.corbyngreenwood\.com){1}(\/){0,1}\z/mi]
    #   resource '/auth',
    #     headers: :any,
    #     methods: [:post, :options]
    #   resource '/todo',
    #     headers: :any,
    #     methods: [:get, :post, :delete, :options]
    # end

    # Above is still here as it was for testing. I think Docker causes this to not work correctly through GCP.
    # More investigation required to figure this one out.
    # Google doesn't support CORS on cloud run apparently, as stupid as that shit is. Open API. Will learn CORS with a real cloud provider.
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