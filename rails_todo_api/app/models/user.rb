class User
    attr_accessor :id, :username, :password, :created_at

    def initialize(id, user = {})
        self.id = id
        self.username = user[:username] unless user.nil?
        self.password = user[:password] unless user.nil?
        self.created_at = user[:created_at] unless user.nil?
    end
end