class CreateHistoricals < ActiveRecord::Migration[6.1]
  def change
    create_table :historicals do |t|
      t.date :date
      t.integer :user_id
      t.float :portfolio_value

      t.timestamps
    end
  end
end
