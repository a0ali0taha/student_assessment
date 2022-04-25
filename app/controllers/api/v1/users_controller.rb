class Api::V1::UsersController < ApplicationController
    before_action :set_api_v1_user, only: %i[ show update destroy ]
  
    # GET /api/v1/users
    def index
      @api_v1_users = authorize model.all
  
      render json: @api_v1_users.as_json(methods: [:type])
    end
  
    # GET /api/v1/users/1
    def show
  
      render json: @api_v1_user.as_json(methods: [:type])
    end
  
    # POST /api/v1/users
    def create
      @api_v1_user =authorize model.new(api_v1_user_params)
  
      if @api_v1_user.save
        render json: @api_v1_user, status: :created
      else
        render json: @api_v1_user.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /api/v1/users/1
    def update
      if @api_v1_user.update(api_v1_user_params)
        render json: @api_v1_user
      else
        render json: @api_v1_user.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /api/v1/users/1
    def destroy
      @api_v1_user.destroy
    end
  
    private
    
        def model
            controller_name.classify.constantize
        end
    # Use callbacks to share common setup or constraints between actions.
      def set_api_v1_user
        @api_v1_user =     authorize model.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def api_v1_user_params
        params.fetch(:user, {}).permit(:name, :email,:password,:type)
        # params.require(:user).permit(:name)
      end
  end
  