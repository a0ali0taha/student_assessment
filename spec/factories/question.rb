FactoryBot.define do
    factory :question do
      label { Faker::Name.name}
      description { Faker::Name.name}
      association :option, factory: :option
    end

  end