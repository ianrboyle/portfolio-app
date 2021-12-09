class IndustrySerializer < ActiveModel::Serializer
  attributes :id, :industry, :industry_percent_of_account, :sectors, :stocks, :sector_percent_of_industry
end
