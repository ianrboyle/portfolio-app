class Stock < ApplicationRecord
  belongs_to :user
  belongs_to :sector
  belongs_to :industry

  def current_total_value
    (quantity * current_price).round(3)
  end
end
