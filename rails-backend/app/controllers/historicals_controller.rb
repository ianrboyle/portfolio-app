class HistoricalsController < ApplicationController
  before_action :authenticate_user
  def index
    historicals = current_user.historicals
    render json: historicals
  end
  #I only want to show the most current historical data when this show method is called
  def show
    historical = current_user.historicals.last
    render json: historical
  end
  def create
    historicals = Historical.where(date: Date.today())
    historicals.each{|historical| historical.destroy}
    stocks = current_user.stocks
    if stocks
      
      historical = Historical.new(
        user_id: current_user.id,
        date: Date.today(),
        portfolio_value: stocks[0].current_account_value
      )
    else
      historical = Historical.new(
        user_id: current_user.id,
        date: Date.today(),
        portfolio_value: 0
      )
    end
    if historical.save
      render json: historical
    else
      render json: {errors: historical.errors.full_messages}, status: 418
    end
  end

  def destroy
    historical = Historical.find_by(id: params[:id])
    historical.destroy
    render json: {message: "Historical data removed"}
  end
end
