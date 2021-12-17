class Stock < ApplicationRecord
  belongs_to :user
  belongs_to :sector
  belongs_to :industry

  #calculates the current total value for an individual stock
  def current_total_value
    (quantity * current_price).round(3)
  end
  #calculates the cost_basis value for an individual stock
  def current_stock_cost_basis
    (quantity * cost_basis).round(3)
  end

  #calculates the current account value
  def current_account_value
    stocks = Stock.where(user_id: user.id)
    stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
  end
  
  #calculates the original cost basis for all stocks
  def total_cost_basis
    stocks = Stock.where(user_id: user.id)
    stocks.reduce(0){|sum, stock| sum + stock.current_stock_cost_basis}
  end

  #calculates what % a stock is of the overall portfolio
  def percent_of_account
    # stocks = Stock.where(user_id: user.id)
    # account_value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    #how do we select the current stock?
    (current_total_value/current_account_value * 100).round(2)
  end

  #calculates the total gain/loss for an individual stock
  def total_gain_loss
    ((current_price - cost_basis) * quantity).round(3)
  end

  #calculates the total gain/loss % for an individual stock
  def total_gain_loss_percent
    ((total_gain_loss/current_stock_cost_basis)*100).round(2)
  end

  def account_total_gain_loss
    (current_account_value - total_cost_basis).round(3)
  end

  def account_total_gain_loss_percent
    ((account_total_gain_loss/total_cost_basis)*100).round(2)
  end
  def stock_percent_of_sector
    ((current_total_value/sector.sector_value)*100).round(2)
  end
  
  def stock_percent_of_industry
    ((current_total_value/industry.industry_value)*100).round(2)
  end

end
