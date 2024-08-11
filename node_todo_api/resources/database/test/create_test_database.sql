-- MySQL scripts for dropping existing tables and recreating the database table structure
use node_todo_test;

-- ### DROP EVERYTHING ###
-- Tables/views must be dropped in reverse order due to referential constraints (foreign keys).
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `Todo`;
DROP TABLE IF EXISTS `User`;

-- ### TABLES ###
-- Tables must be created in a particular order due to referential constraints i.e. foreign keys.
CREATE TABLE `User`
(
  username VARCHAR
(50) NOT NULL,
  password VARCHAR
(256) NOT NULL,
  PRIMARY KEY
(username),
  UNIQUE
(username)
)
ENGINE = InnoDB;

CREATE TABLE `Session`
(
  session_token VARCHAR
(128) NOT NULL,
  created_at DATETIME NOT NULL,
  user_id VARCHAR
(128) NOT NULL,
  PRIMARY KEY
(session_token),
  FOREIGN KEY
(user_id) REFERENCES `User`
(username)
)
ENGINE = InnoDB;

CREATE TABLE `Todo`
(
  todo_id VARCHAR
(128) NOT NULL,
  created_at DATETIME NOT NULL,
  title VARCHAR
(256) NOT NULL,
  user_id VARCHAR
(64) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY
(todo_id),
  FOREIGN KEY
(user_id) REFERENCES `User`
(username)
)
ENGINE = InnoDB;

CREATE INDEX `Todo_user_id` ON `Todo`
(user_id);
CREATE INDEX `Session_user_id` ON `Session`
(user_id);
CREATE INDEX `Session_token` ON `Session`
(session_token);
CREATE INDEX `Todo_created_at` ON `Todo`
(created_at);