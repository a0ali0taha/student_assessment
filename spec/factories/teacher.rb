FactoryBot.define do
    factory :teacher do
      name { Faker::Name.name}
      email { Faker::Internet.email}
      password {Faker::Internet.password }
    end
  end