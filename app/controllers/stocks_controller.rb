class StocksController < ApplicationController
  def index
    stocks = Stock.all
    render json: stocks.as_json
  end
  def show
    stock = Stock.find_by(id: params[:id])
    render json: stock.as_json
  end
end
