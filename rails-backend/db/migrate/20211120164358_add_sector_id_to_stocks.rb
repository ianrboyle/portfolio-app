class AddSectorIdToStocks < ActiveRecord::Migration[6.1]
  def change
    add_column :stocks, :sector_id, :integer
  end
end
