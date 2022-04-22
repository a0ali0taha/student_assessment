class Api::V1::OptionsController < ApplicationController
  before_action :set_api_v1_option, only: %i[ show update destroy ]

  # GET /api/v1/options
  def index
    @api_v1_options = Option.all

    render json: @api_v1_options
  end

  # GET /api/v1/options/1
  def show
    render json: @api_v1_option
  end

  # POST /api/v1/options
  def create
    @api_v1_option = Option.new(api_v1_option_params)

    if @api_v1_option.save
      render json: @api_v1_option, status: :created, location: @api_v1_option
    else
      render json: @api_v1_option.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/options/1
  def update
    if @api_v1_option.update(api_v1_option_params)
      render json: @api_v1_option
    else
      render json: @api_v1_option.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/options/1
  def destroy
    @api_v1_option.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_option
      @api_v1_option = Option.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_option_params
      params.fetch(:api_v1_option, {})
    end
end
