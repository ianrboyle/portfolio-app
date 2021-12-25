class NewsController < ApplicationController
  def index
    require './.api_key.rb'

    dji_response = HTTP.get("https://api.stockdata.org/v1/news/all?exchanges=DJI&filter_entities=true&language=en&api_token=#{$stock_data_api}")

    dji_response = dji_response.parse(:json)

    # nasdaq_response = HTTP.get("https://api.stockdata.org/v1/news/all?exchanges=NASDAQ&filter_entities=true&language=en&api_token=#{$stock_data_api}")
    # nasdaq_response = nasdaq_response.parse(:json)
    # index = 0
    # while index < 6

    #   index +=1
    # end
    #   puts response["data"][0]["title"]
    #   puts response["data"][0]["snippet"]
    #   puts response["data"][0]["url"]
    #   puts response["data"][1]["title"]
    #   puts response["data"][1]["snippet"]
    render json: dji_response
  end
end
