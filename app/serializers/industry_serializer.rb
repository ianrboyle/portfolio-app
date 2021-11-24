class IndustrySerializer < ActiveModel::Serializer
  attributes :id, :industry, :industry_percent_of_account, :sectors, :stocks
end
