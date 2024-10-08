class V1::AuthController < V1::ApplicationController
  before_action :get_services, only: [:signup, :signout, :signin]
  before_action :verify_auth_token, only: [:signout]

  def signup
    session = get_services.auth_service.signup(params[:username], params[:password])
    if session.nil? then
      render json: { error: 'User already exists, or you provided invalid data.' }, status: :bad_request
    else 
      render json: session
    end
  end

  def signout
    get_services.auth_service.signout(@session[:session_token])
    render json: { message: 'Successfully signed out.' }
  end

  def signin
    session = get_services.auth_service.signin(params[:username], params[:password])
    if session.nil? then
      render json: { error: 'Invalid username or password.' }, status: :bad_request
    else 
      render json: session
    end
  end
end
