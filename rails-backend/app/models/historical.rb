class Historical < ApplicationRecord
  belongs_to :user
  def current_user_h
    historicals = Historical.where(user_id: user.id)
    yesterday_date = date-1
    
    yesterday = historicals.find_by(date: yesterday_date)
    if yesterday
      (portfolio_value - yesterday.portfolio_value).round(2) 
    else
      return "no data"
    end
  end

  def day_gain_loss
    historicals = Historical.where(user_id: user.id)
    yesterday_date = date-1
    
    yesterday = historicals.find_by(date: yesterday_date)
    if yesterday
      (portfolio_value - yesterday.portfolio_value).round(2) 
    else
      return "no data"
    end
  end

  def day_gain_loss_percent
    historicals = Historical.where(user_id: user.id)
    yesterday_date = historicals[-1].date - 1
  
    yesterday = historicals.find_by(date: yesterday_date)
    if yesterday && historicals.length > 1 && day_gain_loss != "no data"
      ((day_gain_loss/portfolio_value)*100).round(2)

    else
      return "no data"
    end
  end

  def month_gain_loss
    historicals = Historical.where(user_id: user.id)
    last_month_date = date - 30
    last_month = historicals.find_by(date: last_month_date)
    if last_month
      (portfolio_value - last_month.portfolio_value).round(2)
    else
      return "no data"
    end
  end

  def month_gain_loss_percent
    historicals = Historical.where(user_id: user.id)
    last_month_date = date - 30
    last_month = historicals.find_by(date: last_month_date)
    if last_month && month_gain_loss != "no data"
      (month_gain_loss/portfolio_value * 100).round(2)
    else
      return "no data"
    end
  end
end
