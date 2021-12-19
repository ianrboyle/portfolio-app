class HistoricalsController < ApplicationController
  before_action :authenticate_user
  def create
    stocks = current_user.stocks
    historical = Historical.new(
      user_id: current_user.id,
      date: Date.today(),
      portfolio_value: stocks[0].current_account_value
    )
    if historical.save
      render json: historical
    else
      render json: {errors: historical.errors.full_messages}, status: 418
    end
  end
end
