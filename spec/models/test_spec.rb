require "./test/test_helper"
class TestSpec < ActiveSupport::TestCase
 describe "test model" do
   before(:all) do
    #  @test1 = FactoryBot.create(:test)
   end
    # it "is valid with valid attributes" do
    #   expect(@test1).to be_valid
    # end
    it "is not valid without a questions" do
      test2 = FactoryBot.build(:test)
      expect(test2).to_not be_valid
    end
    # it "is not valid without a name" do
    #   test2 = FactoryBot.build(:test, name: nil)
    #   expect(test2).to_not be_valid
    # end

    # it "is not valid without description" do
    #   test2 = FactoryBot.build(:test, description: nil)
    #   expect(test2).to_not be_valid
    # end

    # it "is not valid without a name of min length 5" do
    #   test2 = FactoryBot.build(:test, name: "Min")
    #   expect(test2).to_not be_valid
    # end

    # it "is not valid without description of min length 5" do
    #   test2 = FactoryBot.build(:test, description: "Min")
    #   expect(test2).to_not be_valid
    # end
  end
end