class V1::AuthController < V1::ApplicationController
  before_action :get_auth_service
  before_action :verify_auth_token, only: %i[signout]

  def signup
    session = @auth_service.signup(params[:username], params[:password])
    if session.nil? then
      render json: { error: 'User already exists, or you provided invalid data.' }, status: :bad_request
    else 
      render json: session
    end
  end

  def signout
    @auth_service.signout(@session[:session_token])
    render json: { message: 'Successfully signed out.' }
  end

  def signin
    session = @auth_service.signin(params[:username], params[:password])
    if session.nil? then
      render json: { error: 'Invalid username or password.' }, status: :bad_request
    else 
      render json: session
    end
  end
end
