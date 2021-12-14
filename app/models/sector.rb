class Sector < ApplicationRecord
  # belongs_to :user
  has_many :stocks
  has_many :industries, through: :stocks
  def sector_percent_of_account
    all_stocks = Stock.all
    account_value = all_stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    #below, stocks is stocks only belonging to a particular sector
    sector_value = stocks.reduce(0){|sum, stock| sum + stock.current_total_value}
    (sector_value/account_value * 100).round(2)
  end

  def industry_percent_of_sector
    
  end
end
