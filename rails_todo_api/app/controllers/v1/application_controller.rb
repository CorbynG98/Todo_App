class V1::ApplicationController < ActionController::API  
    private
    def get_auth_service
        @auth_service = AuthService.new
    end

    def get_auth_header
        @auth_header = request.headers['Authorization']
    end
    
    def get_todo_service
        @todo_service = TodoService.new
    end

    def verify_auth_token
        # Get header from request. Strip Bearer word and any spaces.
        auth_header = request.headers['Authorization']
        if auth_header.nil? || auth_header.empty? then 
            render json: { error: 'No token provided.' }, status: :unauthorized
        else
            session_token = auth_header.gsub('Bearer', '').strip
            # Verify token is valid. If not, return 401.
            @session = @auth_service.verify_token(session_token)
            if @session.nil? then render json: { error: 'Invalid token.' }, status: :unauthorized end
        end
    end
  end
  