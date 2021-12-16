class Industry < ApplicationRecord
  has_many :stocks
 
  def industry_value 
    value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    value.round(2)
  end
  def industry_percent_of_account
    all_stocks = Stock.all
    account_value = all_stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    industry_value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    (industry_value/account_value * 100).round(2)
  end

end
