class Api::V1::UsersController < ApplicationController
    before_action :set_api_v1_user, only: %i[ show update destroy ]
  
    # GET /api/v1/users
    def index
      @users = authorize model.all
  
      render json: @users.as_json(methods: [:type],except: [:password_digest])
    end
  
    # GET /api/v1/users/1
    def show
      authorize @user
      render json: @user.as_json(methods: [:type])
    end
  
    # POST /api/v1/users
    def create
      @user =authorize model.new(api_v1_user_params)
  
      if @user.save
        render json: @user.as_json(except: [:password_digest]), status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /api/v1/users/1
    def update
      if @user.update(api_v1_user_params)
        render json: @user.as_json(except: [:password_digest])
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /api/v1/users/1
    def destroy
      authorize @user
      @user.destroy
      render json:{message: 'deleted successfully'}

    end
  
    private
    
        def model
            controller_name.classify.constantize
        end
    # Use callbacks to share common setup or constraints between actions.
      def set_api_v1_user
        @user =     authorize model.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def api_v1_user_params
        params.fetch(:user, {}).permit(:name, :email,:password,:type)
        # params.require(:user).permit(:name)
      end
  end
  