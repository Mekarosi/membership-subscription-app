Rails.application.routes.draw do
  resources :communicates
  root to: "pages#home"
  get 'about', to: 'pages#about'
  # resources :contacts
end
