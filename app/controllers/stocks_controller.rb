class StocksController < ApplicationController
  before_action :authenticate_user
  def index
    require 'uri'
    require 'net/http'
    require 'openssl'
    require 'JSON'
    require './.api_key.rb'
    stocks = current_user.stocks
    stocks.each{|stock|
      quote_url = URI("https://yfapi.net/v6/finance/quote?symbols=#{stock.symbol}")
      quote_http = Net::HTTP.new(quote_url.host, quote_url.port)
      quote_http.use_ssl = true
      quote_http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      q_request = Net::HTTP::Get.new(quote_url)
      q_request["x-api-key"] = "#{$yahoo_key}"

      q_response = quote_http.request(q_request)
      q_result = JSON.parse(q_response.body)

      response = HTTP.get("https://financialmodelingprep.com/api/v3/profile/#{stock.symbol}?apikey=#{$api_key}")
      f_m_info = response.parse(:json)
      if f_m_info[0]
        ask_price = f_m_info[0]["price"]
        stock.current_price = ask_price
        stock.save
      else
        ask_price = q_result["quoteResponse"]["result"][0]["regularMarketPrice"]
        stock.current_price = ask_price
        stock.save
      end
    }
    render json: stocks
  end

  def show
    stock = Stock.find_by(id: params[:id])
    render json: stock
  end
  
  def create
    require './.api_key.rb'
    require 'uri'
    require 'net/http'
    require 'openssl'
    require 'JSON'

    ### Quote Summary API call
    quote_summary_url = URI("https://yfapi.net/v11/finance/quoteSummary/#{params[:symbol]}?lang=en&region=US&modules=defaultKeyStatistics%2CassetProfile")

    quote_summary_http = Net::HTTP.new(quote_summary_url.host, quote_summary_url.port)
    quote_summary_http.use_ssl = true
    quote_summary_http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    q_s_request = Net::HTTP::Get.new(quote_summary_url)
    q_s_request["x-api-key"] = "#{$yahoo_key}"

    q_s_response = quote_summary_http.request(q_s_request)
    q_s_result = JSON.parse(q_s_response.body)

    #Quote API Call
    quote_url = URI("https://yfapi.net/v6/finance/quote?symbols=#{params[:symbol]}")
    quote_http = Net::HTTP.new(quote_url.host, quote_url.port)
    quote_http.use_ssl = true
    quote_http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    q_request = Net::HTTP::Get.new(quote_url)
    q_request["x-api-key"] = "#{$yahoo_key}"

    q_response = quote_http.request(q_request)
    q_result = JSON.parse(q_response.body)

    quote_industry = q_s_result["quoteSummary"]["result"][0]["assetProfile"]["industry"]
    quote_sector = q_s_result["quoteSummary"]["result"][0]["assetProfile"]["sector"]
    quote_ask_price = q_result["quoteResponse"]["result"][0]["regularMarketPrice"]
    quote_stock_symbol = q_result["quoteResponse"]["result"][0]["symbol"]
    quote_company_name = q_result["quoteResponse"]["result"][0]["longName"]

    #check to see if stock already exists
    stock_exist = Stock.find_by(symbol: params[:symbol])
    sector = Sector.find_by(sector: quote_sector)
    industry = Industry.find_by(industry: quote_industry)
    if stock_exist
      stock = stock_exist
      original_total_cost_basis = stock.cost_basis * stock.quantity
      original_quantity = stock.quantity
      stock.quantity = original_quantity.to_f + params[:quantity].to_f
      stock.cost_basis = ((original_total_cost_basis.to_f + (params[:cost_basis].to_f * params[:quantity].to_f))/stock.quantity).round(2)
      stock.current_price = quote_ask_price
    #check to see if the sector and industry already exists
 
    elsif sector && industry
      stock = Stock.new(
        user_id: current_user.id,
        symbol: quote_stock_symbol,
        company_name: quote_company_name,
        cost_basis: params[:cost_basis],
        current_price: quote_ask_price,
        quantity: params[:quantity],
        sector_id: sector.id,
        industry_id: industry.id
      )
    #check to see if the sector exists, but not the industry
    elsif sector && !industry
      new_industry = Industry.new(industry: quote_industry)
      new_industry.save
      stock = Stock.new(
        user_id: current_user.id,
        symbol: quote_stock_symbol,
        company_name: quote_company_name,
        cost_basis: params[:cost_basis],
        current_price: quote_ask_price,
        quantity: params[:quantity],
        sector_id: sector.id,
        industry_id: new_industry.id
      )
      #check to see if the industry exists, but not the sector
    elsif industry && !sector
      new_sector = Sector.new(
        sector: quote_sector
      )
      new_sector.save
      stock = Stock.new(
        user_id: current_user.id,
        symbol: quote_stock_symbol,
        company_name: quote_company_name,
        cost_basis: params[:cost_basis],
        current_price: quote_ask_price,
        quantity: params[:quantity],
        sector_id: new_sector.id,
        industry_id: industry.id
      )
      #if neither stock, nor sector, nor industry exist
    else
      new_sector = Sector.new(
        sector: quote_sector
      )
      new_sector.save
      new_industry = Industry.new(industry: quote_industry)
      new_industry.save
      stock = Stock.new(
        user_id: current_user.id,
        symbol: quote_stock_symbol,
        company_name: quote_company_name,
        cost_basis: params[:cost_basis],
        current_price: quote_ask_price,
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

    ask_price = stock_info["quoteResponse"]["result"][0]["regularMarketPrice"]
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
