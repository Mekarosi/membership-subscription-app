Rails.application.routes.draw do
  devise_for :users
  devise_scope :user do
  get '/users/sign_out' => 'devise/sessions#destroy'
end
  root to: "pages#home"
  get 'about', to: 'pages#about'
  resources :communicates, only: :create
  get 'communicate-with-us', to: 'communicates#new', as: 'new_communicate'
end
