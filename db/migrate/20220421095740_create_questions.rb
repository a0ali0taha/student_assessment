class CreateQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :questions do |t|
      t.string :label
      t.text :description

      t.timestamps
    end
  end
end
