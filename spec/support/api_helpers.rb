module ApiHelpers
    def json
        response
      JSON.parse(response.body)
    end
  end