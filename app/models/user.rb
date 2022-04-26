class User < ApplicationRecord
    has_secure_password
    validates :name, :email, :type, presence: true
    validates :email, uniqueness: true
  
  
    def token
      token = AuthenticateUser.call(email, password).result[:token]
    end
    def _type
      type
      end
end
