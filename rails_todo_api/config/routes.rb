Rails.application.routes.draw do
  get 'todo', to: 'todo#get'
  post 'todo', to: 'todo#create'
  delete 'todo/:id', to: 'todo#remove'

  post 'todo/togglecomplete/:id', to: 'todo#togglecomplete'

  post 'auth/signup', to: 'auth#signup'
  post 'auth/signout', to: 'auth#signout'
  post 'auth/signin', to: 'auth#signin'
end
