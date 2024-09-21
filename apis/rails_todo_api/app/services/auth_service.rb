require 'google/cloud/firestore'
require 'securerandom'
require 'json'
require 'bcrypt'
require 'active_record'

class AuthService
    attr_accessor :all

    def initialize
        # Load the default database configuration from database.yml
        db_config = YAML.load_file(File.expand_path('../../config/database.yml', __dir__))['default']

        # Establish the ActiveRecord connection using the default settings
        ActiveRecord::Base.establish_connection(db_config)
    end

    def signup(_username, _password)
        existing_user = User.find_by(username: _username)
        return nil if existing_user
        
        new_user = User.create(username: _username, password: _password)
        return nil unless new_user.persisted?
        
        session_token = Digest::SHA512.hexdigest(SecureRandom.uuid)
        hashed_session_token = Digest::SHA512.hexdigest(session_token)
      
        # Create the session using the method defined in the Session model
        session = Session.create(session_token: hashed_session_token, user_id: user.username, created_at: Time.now.utc)
      
        return session if session.persisted?
        nil  # Return nil if the session creation failed
    end

    def signin(_username, _password)
        user = User.find_by(username: _username)
        return nil unless user
      
        # Check if the provided password matches the stored hashed password using BCrypt
        if BCrypt::Password.new(user.password) == _password
            session_token = SecureRandom.uuid  # Use raw UUID for session token
            hashed_session_token = Digest::SHA512.hexdigest(session_token)
      
            # Create the session using the method defined in the Session model
            
            session = Session.create(session_token: hashed_session_token, user_id: user.username, created_at: Time.now.utc)
            return session if session.persisted?
            nil  # Return nil if the session creation failed
        else
          return nil
        end
    end
      

    def signout(_session_token)
        session = Session.find_by(session_token: Digest::SHA512.hexdigest(_session_token))
        session.destroy if session
    end

    def verify_token(_session_token)
        session = Session.find_by(session_token: Digest::SHA512.hexdigest(_session_token))
        session ? session : nil
      end
end