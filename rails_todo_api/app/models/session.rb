class Session
    attr_accessor :id, :session_token, :created_at

    def initialize(id, session = {})
        self.id = id
        self.session_token = session[:session_token] unless session.nil?
        self.created_at = session[:created_at] unless session.nil?
    end
end