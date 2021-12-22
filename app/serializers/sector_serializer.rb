class SectorSerializer < ActiveModel::Serializer
  has_many :stocks
  has_many :industries, through: :stocks
  attributes :id, :sector, :sector_percent_of_account, :industry_percent_of_sector, :stocks, :industries, :sector_value
end
