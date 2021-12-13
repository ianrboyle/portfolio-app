class StocksController < ApplicationController
  before_action :authenticate_user
  def index
    stocks = current_user.stocks
    stocks.each{|stock|
      require './.api_key.rb'
      response = HTTP.get("https://financialmodelingprep.com/api/v3/profile/#{stock.symbol}?apikey=#{$api_key}")
      stock_info = response.parse(:json)
      stock.current_price = stock_info[0]["price"]
      stock.save
    }
    render json: stocks
  end

  def show
    stock = Stock.find_by(id: params[:id])
    render json: stock
  end
  
  def create
    require './.api_key.rb'
    response = HTTP.get("https://financialmodelingprep.com/api/v3/profile/#{params[:symbol]}?apikey=#{$api_key}")
    stock_info = response.parse(:json)
    #check to see if stock already exists
    stock_exist = Stock.find_by(symbol: params[:symbol])
    sector = Sector.find_by(sector: stock_info[0]["sector"])
    industry = Industry.find_by(industry: stock_info[0]["industry"])
    if stock_exist
      stock = stock_exist
      original_total_cost_basis = stock.cost_basis * stock.quantity
      original_quantity = stock.quantity
      stock.quantity = original_quantity.to_f + params[:quantity].to_f
      stock.cost_basis = ((original_total_cost_basis.to_f + (params[:cost_basis].to_f * params[:quantity].to_f))/stock.quantity).round(2)
      stock.current_price = stock_info[0]["price"]
    #check to see if the sector and industry already exists
 
    elsif sector && industry
      stock = Stock.new(
        user_id: current_user.id,
        symbol: stock_info[0]["symbol"],
        company_name: stock_info[0]["companyName"],
        cost_basis: params[:cost_basis],
        current_price: stock_info[0]["price"],
        quantity: params[:quantity],
        sector_id: sector.id,
        industry_id: industry.id
      )
    #check to see if the sector exists, but not the industry
    elsif sector && !industry
      new_industry = Industry.new(industry: stock_info[0]["industry"])
      new_industry.save
      stock = Stock.new(
        user_id: current_user.id,
        symbol: stock_info[0]["symbol"],
        company_name: stock_info[0]["companyName"],
        cost_basis: params[:cost_basis],
        current_price: stock_info[0]["price"],
        quantity: params[:quantity],
        sector_id: sector.id,
        industry_id: new_industry.id
      )
      #check to see if the industry exists, but not the sector
    elsif industry && !sector
      new_sector = Sector.new(
        sector: stock_info[0]["sector"]
      )
      new_sector.save
      stock = Stock.new(
        user_id: current_user.id,
        symbol: stock_info[0]["symbol"],
        company_name: stock_info[0]["companyName"],
        cost_basis: params[:cost_basis],
        current_price: stock_info[0]["price"],
        quantity: params[:quantity],
        sector_id: new_sector.id,
        industry_id: industry.id
      )
      #if neither stock, nor sector, nor industry exist
    else
      new_sector = Sector.new(
        sector: stock_info[0]["sector"]
      )
      new_sector.save
      new_industry = Industry.new(industry: stock_info[0]["industry"])
      new_industry.save
      stock = Stock.new(
        user_id: current_user.id,
        symbol: stock_info[0]["symbol"],
        company_name: stock_info[0]["companyName"],
        cost_basis: params[:cost_basis],
        current_price: stock_info[0]["price"],
        quantity: params[:quantity],
        sector_id: new_sector.id,
        industry_id: new_industry.id
      )
    end
    
    if stock.save
      render json: stock
    else
      render json: {errors: stock.errors.full_messages}, status: 418
    end
  end

  def update
    require './.api_key.rb'
    require 'uri'
    require 'net/http'
    require 'openssl'
    require 'JSON'
    # using separate apis may not work since sectors/industries differ (sigh)
    url = URI("https://yfapi.net/v6/finance/quote?symbols=#{params[:symbol]}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["x-api-key"] = "#{$yahoo_key}"
    response = http.request(request)

    stock_info = JSON.parse(response.body)

    ask_price = stock_info["quoteResponse"]["result"][0]["ask"]
    company_name = stock_info["quoteResponse"]["result"][0]["longName"]
    stock_info = response.read_body

    stock = Stock.find_by(symbol: params[:symbol])
    stock.user_id = current_user.id
    stock.cost_basis = params[:cost_basis] || stock.cost_basis
    stock.current_price = ask_price
    stock.quantity = params[:quantity] || stock.quantity
    stock.sector_id = params[:sector_id] || stock.sector_id
    stock.sector.sector = params[:sector] || stock.sector.sector
    stock.industry_id = params[:industry_id] || stock.industry_id
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
