class AddUserIdToStocks < ActiveRecord::Migration[6.1]
  def change
    add_column :stocks, :user_id, :integer
  end
end
