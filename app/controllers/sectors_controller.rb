class SectorsController < ApplicationController
  def index
    sectors = Sector.all
    render json: sectors
  end

  def show
    sector = Sector.find_by(id: params[:id])
    render json: sector
  end

  def create
    sector = Sector.new(
      sector: params[:sector]
    )
    sector.save
    if sector.save
      render json: sector
    else
      render json: {errors: sector.errors.full_messages}, status: 406
    end
  end

  def destroy
    sector = Sector.find_by(id: params[:id])
    
    stocks = Stock.where(sector_id: sector.id)
    industries = sector.industries
    if stocks
      stocks.each{|stock| stock.destroy}
      industries.each{|industry| industry.destroy}
      sector.destroy
    else
      sector.destroy
    end
    render json: {message: "Sector removed from portfolio."}
  end
end
