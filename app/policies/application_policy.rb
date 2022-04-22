# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    teacher?
  end

  def show?
    teacher?
  end

  def create?
    teacher?
  end

  def new?
    create?
  end

  def update?
    teacher?
  end

  def edit?
    update?
  end

  def destroy?
    teacher?
  end
private 
  def teacher?
    user.is_a? Teacher
  end
  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NotImplementedError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope
    
  
  end
end
