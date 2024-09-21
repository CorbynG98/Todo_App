require 'google/cloud/firestore'
require 'securerandom'
require 'bcrypt'
require 'active_record'
require_relative '../models/dto/session.dto'

class AuthService
    attr_accessor :all

    def initialize
        puts "AuthService initialize"
        begin
            db_config = YAML.load_file(File.expand_path('../../config/database.yml', __dir__), aliases: true)['default']
            ActiveRecord::Base.establish_connection(db_config)
        rescue => e
            puts "Error in initialize: #{e.message}"
        end
    end

    def signup(_username, _password)
        existing_user = User.find_by(username: _username)
        return nil if existing_user
        
        new_user = User.create(username: _username, password: _password)
        return nil unless new_user&.persisted?
        
        session_token = Digest::SHA512.hexdigest(SecureRandom.uuid)
      
        # Create the session using the method defined in the Session model
        session = Session.create_session(session_token: session_token, user_id: user.username)

        # Create sessionDto to return
        session_dto = SessionDto.new({session_token: session_token, username: user.username})
      
        return session_dto
    end

    def signin(_username, _password)
        user = User.find_by(username: _username)
        return nil unless user
      
        # Check if the provided password matches the stored hashed password using BCrypt
        if BCrypt::Password.new(user.password) == _password
            session_token = Digest::SHA512.hexdigest(SecureRandom.uuid)
      
            # Create the session using the method defined in the Session model
            session = Session.create_session(session_token: session_token, user_id: user.username)

            # Create sessionDto to return
            session_dto = SessionDto.new({session_token: session_token, username:  user.username})

            return session_dto if session&.persisted?
            nil
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