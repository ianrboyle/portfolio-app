Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  ###USER ROUTES###
  post "/users" => "users#create"

  ###SESSIONS ROUTES###
  post "/sessions" => "sessions#create"
end
