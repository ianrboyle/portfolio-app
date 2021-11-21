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
      industry: params[:industry]
    )
    industry.save
    if industry.save
      render json: industry
    else
      render json: {errors: industry.errors.full_messages}, status: 406
    end
  end
end
