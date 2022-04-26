class ApplicationController < ActionController::API
    before_action :authenticate_request
    attr_reader :current_user
    include Pundit::Authorization
    # after_action :verify_authorized
    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
    rescue_from ActionController::UnpermittedParameters, with: :render_unpermitted_params_response
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response
    rescue_from ActionDispatch::Http::Parameters::ParseError, with: :bad_request
    

    
    def bad_request
      render json: {message: "bad request, check Parameters format"}, status: :bad_request
    end

    def render_not_found_response
      render json: {message: "record not found"}, status: :not_found
    end
    
    def render_unpermitted_params_response
      render json: { "Unpermitted Parameters": params.to_unsafe_h.except(:controller, :action, :id, :username, :password).keys }, status: :unprocessable_entity
    end
    private

    def user_not_authorized
      render json: {message: "You are not authorized to perform this action."}
    end
    # Authorized users who have a valid token
    def authenticate_request
      @current_user = AuthorizeApiRequest.call(request.headers).result
      render json: { error: 'Not Authorized', status: 401 }, status: 401 unless @current_user
    end
end
