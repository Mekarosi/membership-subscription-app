Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  get 'about', to: 'pages#about'
  resources :communicates, only: :create
  get 'communicate-with-us', to: 'communicates#new', as: 'new_communicate'
end
