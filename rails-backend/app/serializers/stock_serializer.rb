class StockSerializer < ActiveModel::Serializer
  
  belongs_to :sector
  belongs_to :industry
  
  attributes :id, :user, :symbol, :company_name, :sector_values, :quantity, :current_total_value, :current_price, :cost_basis, :total_cost_basis, :percent_of_account, :total_gain_loss, :total_gain_loss_percent, :account_total_gain_loss, :account_total_gain_loss_percent, :sector, :industry, :current_account_value, :stock_percent_of_sector, :stock_percent_of_industry
  
end
