class Api::V1::TestsController < ApplicationController
  before_action :set_test, only: %i[  update destroy save_test ]
  
  # GET /api/v1/tests
  def index
    @tests = Test.joins(:questions).group('questions.test_id').select('tests.*, COUNT(*) as question_count')
    render json: @tests
  end

  # GET /api/v1/tests/1
  def show
    @test=Test.get_test_with_all_asosications(params[:id])
    render json: @test
  end

  # POST /api/v1/tests
  def create
    @test = authorize Test.new(test_params)

    if @test.save
      render json: @test, status: :created
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tests/1
  def update
    authorize @test
    if @test.update(test_params)
      render json: @test
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tests/1
  def destroy
    authorize @test
    @test.destroy
    render json:{message: 'deleted successfully'}
  end

  def save_test
    render json:{message: 'saved successfully'}
  end
 
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_test
      @test = Test.find(params[:id])

    end

    # Only allow a list of trusted parameters through.
    def test_params
      p=params.fetch(:test, {}).permit(:name, :description,questions_attributes: [:label,:description, options_attributes: [:title,:is_correct]])

      
    end
end
