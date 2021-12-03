class RemoveUserIdFromSectors < ActiveRecord::Migration[6.1]
  def change
    remove_column :sectors, :user_id, :integer
  end
end
