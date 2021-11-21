class StockSerializer < ActiveModel::Serializer
  attributes :id, :symbol, :company_name, :quantity, :current_price, :cost_basis, :sector, :industry
  belongs_to :sector
  belongs_to :industry
end
