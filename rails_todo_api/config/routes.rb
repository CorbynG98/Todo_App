Rails.application.routes.draw do
  concern :base_api do  
    resources :todo, only: [:index, :create, :destroy]

    post 'todo/togglecomplete/:id', to: 'todo#togglecomplete'
    post 'todo/clearcompleted', to: 'todo#clearcompleted'
  
    post 'auth/signup', to: 'auth#signup'
    post 'auth/signout', to: 'auth#signout'
    post 'auth/signin', to: 'auth#signin'
  end

  namespace :v1 do
    concerns :base_api
  end
end
