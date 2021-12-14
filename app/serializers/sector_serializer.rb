class SectorSerializer < ActiveModel::Serializer
  attributes :id, :sector, :sector_percent_of_account, :stocks, :industries, :industry_percent_of_sector
end
