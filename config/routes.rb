Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


  ###STOCKS ROUTES###
  get "/stocks" => "stocks#index"
  get "/stocks/:id" => "stocks#show"
  post "/stocks" => "stocks#create"
  patch "/stocks/:id" => "stocks#update"
  delete "stocks/:id" => "stocks#destroy"
  ###USER ROUTES###
  post "/users" => "users#create"

  ###SESSIONS ROUTES###
  post "/sessions" => "sessions#create"
end
