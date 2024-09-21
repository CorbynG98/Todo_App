class Session < ActiveRecord::Base
  self.table_name = 'Session'  # Specify the table name explicitly

  # Validations
  validates :user_id, presence: true
  validates :session_token, presence: true, uniqueness: true

  # Override the setter for password
  def session_token=(session_token)
    # Hash the password and store the bcrypt hash in the password column
    super(Digest::SHA512.hexdigest(session_token))
  end

  def self.create_session(session_token:, user_id:)
    session = Session.new(
      session_token: session_token,
      user_id: user_id,
      created_at: Time.now.utc
    )
    # Explicitly save the record
    if session.save
      Rails.logger.info "Session created for user #{session.user_id}"
      session
    else
      Rails.logger.error "Failed to create session: #{session.errors.full_messages.join(', ')}"
      nil
    end
  end
end
