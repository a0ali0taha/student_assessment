class Api::V1::TeachersController < ApplicationController
  before_action :set_api_v1_teacher, only: %i[ show update destroy ]

  # GET /api/v1/teachers
  def index
    @api_v1_teachers = Teacher.all

    render json: @api_v1_teachers
  end

  # GET /api/v1/teachers/1
  def show
    render json: @api_v1_teacher
  end

  # POST /api/v1/teachers
  def create
    @api_v1_teacher = Teacher.new(api_v1_teacher_params)

    if @api_v1_teacher.save
      render json: @api_v1_teacher, status: :created, location: @api_v1_teacher
    else
      render json: @api_v1_teacher.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/teachers/1
  def update
    if @api_v1_teacher.update(api_v1_teacher_params)
      render json: @api_v1_teacher
    else
      render json: @api_v1_teacher.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/teachers/1
  def destroy
    @api_v1_teacher.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_teacher
      @api_v1_teacher = Teacher.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_teacher_params
      params.fetch(:api_v1_teacher, {})
    end
end
