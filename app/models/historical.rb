class Historical < ApplicationRecord
  def day_gain_loss
    yesterday_date = date-1
    
    yesterday = Historical.find_by(date: yesterday_date)
    if yesterday
      (portfolio_value - yesterday.portfolio_value).round(3) 
    else
      return "no data"
    end
  end

  def day_gain_loss_percent
    yesterday_date = date-1
    yesterday = Historical.find_by(date: yesterday_date)
    if yesterday
      ((day_gain_loss/portfolio_value)*100).round(2)
    end
  end

  def month_gain_loss
    last_month_date = date - 30
    last_month = Historical.find_by(date: last_month_date)
    if last_month
      (portfolio_value - last_month.portfolio_value).round(3)
    end
  end

  def month_gain_loss_percent
    last_month_date = date - 30
    last_month = Historical.find_by(date: last_month_date)
    if last_month
     (month_gain_loss/portfolio_value * 100).round(2)
    end
  end
end
