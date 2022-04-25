FactoryBot.define do
    factory :option do
      title { Faker::Name.name}
      is_correct { true}
    end

  end