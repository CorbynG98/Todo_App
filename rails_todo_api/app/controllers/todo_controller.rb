class TodoController < ApplicationController
  before_action :get_auth_service
  before_action :get_todo_service
  before_action :verify_auth_token

  def get
    @todos = @todo_service.get_todos(@session[:user_id])
    render json: @todos
  end

  def create
    new_todo = @todo_service.save_todo(params[:title], @session[:user_id]) if params[:title].present?
    render json: new_todo
  end

  def togglecomplete
    result = @todo_service.toggle_complete(params[:id], @session[:user_id]) if params[:id].present?
    if result == false then render json: { error: 'Unable to toggle this todo item' }, status: :bad_request end
  end

  def remove
    result = @todo_service.remove(params[:id], @session[:user_id]) if params[:id].present?
    if result == false then render json: { error: 'Unable to remove this todo item' }, status: :bad_request end
  end

  def clearcompleted
    result = @todo_service.clear_completed(@session[:user_id])
    if result == false then render json: { error: 'Unable to clear completed todo items' }, status: :bad_request end
  end
end
