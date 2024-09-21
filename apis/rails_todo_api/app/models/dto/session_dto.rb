class Dto::SessionDto
  attr_accessor :username, :session_token, :created_at

  def initialize(session = {})
      self.username = session[:username] unless session.nil?
      self.session_token = session[:session_token] unless session.nil?
  end
end