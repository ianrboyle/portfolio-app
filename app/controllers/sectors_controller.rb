class SectorsController < ApplicationController
  def index
    sectors = Sector.all 
    render json: sectors.as_json
  end

  def show
    sector = Sector.find_by(id: params[:id])
    render json: sector.as_json
  end
end
