class Question < ApplicationRecord
    belongs_to :test
    has_many :options , dependent: :destroy
    validates :options, :presence => true
    accepts_nested_attributes_for :options
    validate :has_correct_answer

    def has_correct_answer
        self.options.each{|option|
            return if option.is_correct
        }
            errors.add(:options, "at least one option must be correct")
    end
end
