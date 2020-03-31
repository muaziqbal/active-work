ActiveWorkflow::Application.routes.draw do
  resources :agents do
    member do
      post :run
      post :handle_details_post
      put :leave_workflow
      delete :remove_messages
      delete :memory, action: :destroy_memory
    end

    collection do
      put :toggle_visibility
      get :type_details
      get :message_descriptions
      post :validate
      post :complete
      delete :undefined, action: :destroy_undefined
    end

    resources :logs, only: [:index] do
      collection do
        delete :clear
      end
    end

    resources :messages, only: [:index, :show, :destroy] do
      member do
        post :reemit
      end
    end

    scope module: :agents do
      resources :dry_runs, only: [:index, :create]
    end
  end

  scope module: :agents do
    resources :dry_runs, only: [:index, :create]
  end

  resources :workflows do
    collection do
      resource :workflow_imports, only: [:new, :create]
    end

    member do
      get :share
      get :export
      put :enable_or_disable_all_agents
    end

    resource :diagram, only: [:show]
  end

  resources :user_credentials, except: :show do
    collection do
      post :import
    end
  end

  resources :services, only: [:index, :destroy] do
    member do
      post :toggle_availability
    end
  end

  resources :jobs, only: [:index, :destroy] do
    member do
      put :run
    end
    collection do
      delete :destroy_failed
      delete :destroy_all
      post :retry_queued
    end
  end

  namespace :admin do
    resources :users, except: :show do
      member do
        put :deactivate
        put :activate
        get :switch_to_user
      end
      collection do
        get :switch_back
      end
    end
  end

  get '/worker_status' => 'worker_status#show'

  match '/users/:user_id/web_requests/:agent_id/:secret' => 'web_requests#handle_request', :as => :web_requests, :via => [:get, :post, :put, :delete]

  devise_for :users,
             controllers: {
               omniauth_callbacks: 'omniauth_callbacks',
               registrations: 'users/registrations'
             },
             sign_out_via: [:post, :delete]

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: '/letter_opener'
  end

  get '/about' => 'home#about'
  root to: 'home#index'
end
