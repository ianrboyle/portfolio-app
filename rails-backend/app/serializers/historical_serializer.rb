class HistoricalSerializer < ActiveModel::Serializer
  attributes :id, :portfolio_value, :date, :day_gain_loss, :day_gain_loss_percent, :month_gain_loss, :month_gain_loss_percent
end
