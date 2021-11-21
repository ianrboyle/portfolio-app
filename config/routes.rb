Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


  ###STOCKS ROUTES###
  get "/stocks" => "stocks#index"
  get "/stocks/:id" => "stocks#show"
  post "/stocks" => "stocks#create"
  put "/stocks/:id" => "stocks#update"
  delete "stocks/:id" => "stocks#destroy"

  ###SECTORS ROUTES###
  get "/sectors" => "sectors#index"
  get "/sectors/:id" => "sectors#show"
  post "/sectors" => "sectors#create"
  put "/sectors/:id" => "sectors#update"
  delete "sectors/:id" => "sectors#destroy"

  ###USER ROUTES###
  post "/users" => "users#create"

  ###SESSIONS ROUTES###
  post "/sessions" => "sessions#create"
end
