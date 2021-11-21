class StocksController < ApplicationController
  # before_action :authenticate_user
  def index
    stocks = Stock.all
    render json: stocks
  end

  def show
    stock = Stock.find_by(id: params[:id])
    render json: stock
  end
  
  def create
    stock = Stock.new(
      user_id: current_user.id,
      symbol: params[:symbol],
      company_name: params[:company_name],
      cost_basis: params[:cost_basis],
      current_price: params[:current_price],
      quantity: params[:quantity]
    )
    if stock.save
      render json: stock
    else
      render json: {errors: stock.errors.full_messages}, status: 418
    end
  end

  def update
    stock = Stock.find_by(id: params[:id])
    stock.cost_basis = params[:cost_basis] || stock.cost_basis
    stock.current_price = params[:current_price] || stock.current_price
    stock.quantity = params[:quantity] || stock.quantity
    if stock.save
      render json: stock
    else
      render json: {errors: stock.errors.full_messages}, status: 406
    end
  end

  def destroy
    stock = Stock.find_by(id: params[:id])
    stock.destroy
    render json: {message: "Stock removed from portfolio."}
  end
end
