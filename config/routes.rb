Rails.application.routes.draw do
  root to: "pages#home"
  get 'about', to: 'pages#about'
  resources :communicates, only: :create
  get 'communicate-with-us', to: 'communicates#new', as: 'new_communicate'
end
