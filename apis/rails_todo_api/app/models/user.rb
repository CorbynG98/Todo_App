require 'bcrypt'

class User < ActiveRecord::Base
    self.table_name = 'User'  # Specify the table name explicitly
  
    # Validations
    validates :username, presence: true, uniqueness: true
    validates :password, presence: true
  
    # Override the setter for password
    def password=(new_password)
      # Hash the password and store the bcrypt hash in the password column
      super(BCrypt::Password.create(new_password, cost: 12))
    end
end