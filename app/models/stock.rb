class Stock < ApplicationRecord
  belongs_to :user
  belongs_to :sector
  belongs_to :industry

  def current_total_value
    (quantity * current_price).round(3)
  end

  def percent_of_account
    stocks = Stock.where(user_id: user.id)
    account_value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    #how do we select the current stock?
    (current_total_value/account_value * 100).round(2)
  end

  def total_gain_loss
    ((current_price - cost_basis) * quantity).round(3)
  end

  def total_gain_loss_percent
    ((total_gain_loss/(quantity * cost_basis))*100).round(2)
  end

  # def update_price
  #   stocks = Stock.all 
  #   require './.api_key.rb'
    
    
  #   stocks.each{|stock| 
  #     response = HTTP.get("https://financialmodelingprep.com/api/v3/profile/#{stock.symbol}?apikey=#{$api_key}")
  #     stock_info = response.parse(:json)
  #     stock.current_price = stock_info[0]["price"]
  #     stock.save
  #   }
  # end
end
