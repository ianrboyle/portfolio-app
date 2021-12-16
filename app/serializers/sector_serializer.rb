class SectorSerializer < ActiveModel::Serializer
  has_many :stocks
  has_many :industries, through: :stocks

  attributes :id, :sector, :sector_percent_of_account, :stocks, :industries, :industry_percent_of_sector, :sector_value
end
