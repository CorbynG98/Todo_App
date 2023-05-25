class Rack::Attack
    Rack::Attack.enabled = true
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
    # Always allow requests from localhost
    # (blocklist & throttles are skipped)
    # Rack::Attack.safelist('allow from localhost') do |req|
    #     # Requests are allowed if the return value is truthy
    #     '127.0.0.1' == req.ip || '::1' == req.ip
    # end

    # Throttle signin and signup attempts for a given email parameter to 5 reqs/minute
    # Return the IP as a discriminator on POST /auth/signin or /auth/signup requests
    throttle('limit signins and signups per ip', limit: 5, period: 60.seconds) do |req|
        if (req.path.include?('/auth/signout') || req.path.include?('/auth/signup')) && req.post?
            req.params['username'].to_s.downcase.gsub(/\s+/, "").presence
        end
    end

    # # Throttle logout attempts for a given email parameter to 10 reqs/minute
    # # Return the IP as a discriminator on POST /auth/signout requests
    throttle('limit signouts per ip', limit: 10, period: 60.seconds) do |req|
        if req.path.include?('/auth/signout') && req.post?
            req.params['username'].to_s.downcase.gsub(/\s+/, "").presence
        end
    end

    # Throttle logout attempts for a given email parameter to 15 reqs/minute
    # Return the IP as a discriminator on GET /todo requests
    throttle('limit getting todos per ip', limit: 15, period: 60.seconds) do |req|
        if req.path.include?('/todo') && req.get?
            req.env['HTTP_AUTHORIZATION'].gsub('Bearer ', '')
        end
    end
end