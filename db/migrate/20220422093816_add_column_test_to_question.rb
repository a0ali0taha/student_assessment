class AddColumnTestToQuestion < ActiveRecord::Migration[7.0]
  def change
    add_reference :questions, :test, null: false, foreign_key: true
  end
end
