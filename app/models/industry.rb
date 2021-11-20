class Industry < ApplicationRecord
  has_many :stocks
  has_many :sectors, through: :stocks
end
