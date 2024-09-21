# config/initializers/database.rb

Rails.application.configure do
  config.active_record.default_timezone = :local
  
  config.after_initialize do
    Rails.logger.info "Establishing database connection..."
    
    db_config = YAML.load_file(File.expand_path('../../config/database.yml', __dir__), aliases: true)[Rails.env]
    Rails.logger.info "Loaded database configuration for #{Rails.env}"
    
    ActiveRecord::Base.establish_connection(db_config)
    
    Rails.logger.info "Database connection established successfully!"
  end
end