require 'google/cloud/firestore'
require 'securerandom'
require 'json'

class AuthService
    attr_accessor :all

    def initialize
        file = File.read('../resources/appsettings.json')
        data_hash = JSON.parse(file)
        
        @firestore = Google::Cloud::Firestore.new project_id: data_hash["GCP"]["ProjectId"],
            keyfile: Rails.application.credentials.keyfile # Hoping this stays as nil if no keyfile found. We only need this when running locally.
    end

    def signup(_username, _password)
        # Check if this user already exists. Unique usernames only lol.
        existing_ref = @firestore.col("User").doc(_username).get.exists?
        if existing_ref then return nil end
        # Create the user    
        user_ref = @firestore.col("User").doc(_username)
        user_ref.set({
            username: _username,
            password: Digest::SHA256.hexdigest(_password)
        })
        # Authenticate the user
        session_token = Digest::SHA256.hexdigest(SecureRandom.uuid)
        session_ref = @firestore.col("Session").add({
            session_token: Digest::SHA256.hexdigest(session_token),
            user_id: user_ref.document_id,
            created_at: Time.now
        })
        return Session.new(session_ref.document_id, {session_token: session_token, created_at: Time.now})
    end

    def signin(_username, _password)
        user_ref = @firestore.col("User").doc(_username)
        user = user_ref.get
        if user.data[:password] == Digest::SHA256.hexdigest(_password)
            session_token = Digest::SHA256.hexdigest(SecureRandom.uuid)
            session_ref = @firestore.col("Session").add({
                session_token: Digest::SHA256.hexdigest(session_token),
                user_id: user_ref.document_id,
                created_at: Time.now
            })
            return Session.new(session_ref.document_id, {session_token: session_token, created_at: Time.now})
        else
            return nil
        end
    end

    def signout(_session_token)
        session_ref = @firestore.col("Session").where("session_token", "=", _session_token)
        session = session_ref.get.first
        if session.present? then @firestore.col("Session").doc(session.document_id).delete end
    end

    def verify_token(_session_token)
        puts _session_token
        session_ref = @firestore.col("Session").where("session_token", "=", Digest::SHA256.hexdigest(_session_token))
        session = session_ref.get.first
        if session then return session else return nil end
    end
end