class Api::V1::TestsController < ApplicationController
  before_action :set_api_v1_test, only: %i[ show update destroy ]

  # GET /api/v1/tests
  def index
    @api_v1_tests = Test.all

    render json: @api_v1_tests
  end

  # GET /api/v1/tests/1
  def show
    render json: @api_v1_test
  end

  # POST /api/v1/tests
  def create
    @api_v1_test = Test.new(api_v1_test_params)

    if @api_v1_test.save
      render json: @api_v1_test, status: :created, location: @api_v1_test
    else
      render json: @api_v1_test.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tests/1
  def update
    if @api_v1_test.update(api_v1_test_params)
      render json: @api_v1_test
    else
      render json: @api_v1_test.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tests/1
  def destroy
    @api_v1_test.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_test
      @api_v1_test = Test.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_test_params
      params.fetch(:api_v1_test, {})
    end
end
