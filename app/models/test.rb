class Test < ApplicationRecord
    has_many :questions, dependent: :destroy
    validates :questions, :presence => true
    validates :name, :presence => true
    accepts_nested_attributes_for :questions
    def self.get_test_with_all_asosications id
        Test.find(id).to_json(:include => { :questions => {
                                            :include => { :options => {:only => [:title ,:is_correct]} }} })
    end
end
