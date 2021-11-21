class StockSerializer < ActiveModel::Serializer
  attributes :id, :symbol, :company_name, :quantity, :current_total_value, :current_price, :cost_basis, :percent_of_account, :total_gain_loss, :sector, :industry
  belongs_to :sector
  belongs_to :industry
end
