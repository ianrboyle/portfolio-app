class Stock < ApplicationRecord
  belongs_to :user
  belongs_to :sector
  belongs_to :industry

  def current_total_value
    (quantity * current_price).round(3)
  end

  def percent_of_account
    stocks = Stock.all
    account_value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    #how do we select the current stock?
    (current_total_value/account_value * 100).round(2)
  end
end
