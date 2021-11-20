class Stock < ApplicationRecord
  belongs_to :user
  belongs_to :sector
  belongs_to :industry
end
