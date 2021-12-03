class IndustriesController < ApplicationController
  def index
    industries = Industry.all 
    render json: industries
  end

  def show
    industry = Industry.find_by(id: params[:id])
    render json: industry
  end

  def create
    industry = Industry.new(
      user_id: current_user.id,
      industry: params[:industry]
    )
    industry.save
    if industry.save
      render json: industry
    else
      render json: {errors: industry.errors.full_messages}, status: 406
    end
  end
  def destroy
    industry = Industry.find_by(id: params[:id])
    stocks = Stock.find_by(industry_id: industry.id)
    stocks.destroy
    industry.destroy
    render json: {message: "Industry removed from portfolio and all associated stocks."}
  end
end
