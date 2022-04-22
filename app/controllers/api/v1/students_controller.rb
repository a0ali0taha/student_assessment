class Api::V1::StudentsController < ApplicationController
  before_action :set_api_v1_student, only: %i[ show update destroy ]

  # GET /api/v1/students
  def index
    @api_v1_students = Student.all

    render json: @api_v1_students
  end

  # GET /api/v1/students/1
  def show
    render json: @api_v1_student
  end

  # POST /api/v1/students
  def create
    @api_v1_student = Student.new(api_v1_student_params)

    if @api_v1_student.save
      render json: @api_v1_student, status: :created, location: @api_v1_student
    else
      render json: @api_v1_student.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/students/1
  def update
    if @api_v1_student.update(api_v1_student_params)
      render json: @api_v1_student
    else
      render json: @api_v1_student.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/students/1
  def destroy
    @api_v1_student.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_student
      @api_v1_student = Student.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_student_params
      params.fetch(:api_v1_student, {})
    end
end
