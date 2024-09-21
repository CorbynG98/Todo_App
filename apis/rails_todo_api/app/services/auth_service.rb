require 'google/cloud/firestore'
require 'securerandom'
require 'bcrypt'
require 'active_record'
require_relative '../models/dto/session_dto'

class AuthService
    attr_accessor :all

    def signup(_username, _password)
        begin
            existing_user = User.find_by(username: _username)
            return nil if existing_user
            
            new_user = User.create(username: _username, password: _password)
            return nil unless new_user&.persisted?
            
            session_token = Digest::SHA512.hexdigest(SecureRandom.uuid)
        
            # Create the session using the method defined in the Session model
            session = Session.create_session(session_token: session_token, user_id: user.username)

            # Create sessionDto to return
            session_dto = Dto::SessionDto.new({session_token: session_token, username: user.username})
        
            return session_dto
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to signup"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to signup"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end

    def signin(_username, _password)
        begin
            user = User.find_by(username: _username)
            return nil unless user
        
            # Check if the provided password matches the stored hashed password using BCrypt
            if BCrypt::Password.new(user.password) == _password
                session_token = Digest::SHA512.hexdigest(SecureRandom.uuid)
        
                # Create the session using the method defined in the Session model
                session = Session.create_session(session_token: session_token, user_id: user.username)

                # Create sessionDto to return
                session_dto = Dto::SessionDto.new({session_token: session_token, username:  user.username})

                return session_dto if session&.persisted?
                nil
            else
            return nil
            end
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to signin"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to signin"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end
      

    def signout(_session_token)
        begin
            session = Session.find_by(session_token: Digest::SHA512.hexdigest(_session_token))
            session.destroy if session
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to signout"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to signout"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end

    def verify_token(_session_token)
        begin
            session = Session.find_by(session_token: Digest::SHA512.hexdigest(_session_token))
            session ? session : nil
        rescue ActiveRecord::RecordInvalid => e
            err = "Failed to verify token"
            Rails.logger.error "#{err}: #{e}"
            err
        rescue ActiveRecord::StatementInvalid => e
            err = "SQL Error: Failed to verify token"
            Rails.logger.error "#{err}: #{e}"
            err
        end
    end
end