class AddUserIdToSectors < ActiveRecord::Migration[6.1]
  def change
    add_column :sectors, :user_id, :integer
  end
end
