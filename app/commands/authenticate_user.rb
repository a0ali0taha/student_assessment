class AuthenticateUser
  prepend SimpleCommand

  def initialize(email, password, portal)
    @email = email
    @password = password
    @portal = portal
  end

  def call
    {token:JsonWebToken.encode(user_id: user.id),user:user} if user
  end

  private

  attr_accessor :email, :password , :portal

  def user
    if portal
      user = Teacher.find_by_email(email)
    else
      user = User.find_by_email(email)
    end
    return user if user && user.authenticate(password)

    errors.add :user_authentication, 'invalid credentials or not allowed'
    nil
  end
end