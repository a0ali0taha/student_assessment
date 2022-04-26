Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # resources :questions
      resources :tests do
        member do
          post 'save_test'
          
        end

      end
      resources :students
      resources :teachers
      # resources :options
      resources :users
    end
  end
  post 'auth/login', to: 'authentication#authenticate'
  post 'portal/auth/login', to: 'authentication#authenticate_portal'


  get '*other', to: redirect('/')
end
