class Sector < ApplicationRecord
  has_many :stocks

  def sector_percent_of_account
    all_stocks = Stock.all
    account_value = all_stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    sector_value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    (sector_value/account_value * 100).round(2)
  end
end
