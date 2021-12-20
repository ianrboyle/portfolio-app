Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


  ###STOCKS ROUTES###
  get "/stocks" => "stocks#index"
  get "/stocks/:id" => "stocks#show"
  post "/stocks/:symbol" => "stocks#create"
  patch "/stocks/:symbol" => "stocks#update"
  delete "stocks/:id" => "stocks#destroy"

  ###SECTORS ROUTES###
  get "/sectors" => "sectors#index"
  get "/sectors/:id" => "sectors#show"
  post "/sectors" => "sectors#create"
  delete "/sectors/:id" => "sectors#destroy"

  ###INDUSTRY ROUTES###
  get "/industries" => "industries#index"
  get "/industries/:id" => "industries#show"
  post "/industries" => "industries#create"
  delete "/industries/:id" => "industries#destroy"

  ### HISTORICAL ROUTES
  get "/historicals" => "historicals#index"
  post "/historicals" => "historicals#create"
  delete "/historicals/:id" => "historicals#destroy"

  
  ###USER ROUTES###
  post "/users" => "users#create"

  ###SESSIONS ROUTES###
  post "/sessions" => "sessions#create"
end
