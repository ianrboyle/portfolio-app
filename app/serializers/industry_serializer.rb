class IndustrySerializer < ActiveModel::Serializer
  has_many :stocks
  attributes :id, :industry, :industry_percent_of_account, :stocks, :industry_value
end
