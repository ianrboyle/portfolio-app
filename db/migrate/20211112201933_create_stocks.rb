class CreateStocks < ActiveRecord::Migration[6.1]
  def change
    create_table :stocks do |t|
      t.string :symbol
      t.string :company_name
      t.float :cost_basis
      t.float :current_price
      t.float :quantity

      t.timestamps
    end
  end
end
