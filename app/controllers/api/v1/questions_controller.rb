class Api::V1::QuestionsController < ApplicationController
  before_action :set_api_v1_question, only: %i[ show update destroy ]

  # GET /api/v1/questions
  def index
    @api_v1_questions = Question.all

    render json: @api_v1_questions
  end

  # GET /api/v1/questions/1
  def show
    render json: @api_v1_question
  end

  # POST /api/v1/questions
  def create
    @api_v1_question = Question.new(api_v1_question_params)

    if @api_v1_question.save
      render json: @api_v1_question, status: :created, location: @api_v1_question
    else
      render json: @api_v1_question.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/questions/1
  def update
    if @api_v1_question.update(api_v1_question_params)
      render json: @api_v1_question
    else
      render json: @api_v1_question.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/questions/1
  def destroy
    @api_v1_question.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_question
      @api_v1_question = Question.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_question_params
      params.fetch(:api_v1_question, {})
    end
end
