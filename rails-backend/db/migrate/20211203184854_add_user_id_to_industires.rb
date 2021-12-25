class AddUserIdToIndustires < ActiveRecord::Migration[6.1]
  def change
    add_column :industries, :user_id, :integer
  end
end
