
FactoryBot.define do
    factory :test do
      # test attributes
      
 
            # test attributes
    name { Faker::Name.name}
    description { Faker::Name.name}
    
         questions_attributes  {[
            {
        
                "label": Faker::Name.name,
                "description": Faker::Name.name,
    
         
                "options_attributes": [
                    {
                        "title": Faker::Name.name,
                        "is_correct": false
                    },
                    {
                        "title": "title2",
                        "is_correct": true
                    },
                    {
                        "title": "title2",
                        "is_correct": false
                    }
                ]
            }
        ]
    }
      
    end
  end
