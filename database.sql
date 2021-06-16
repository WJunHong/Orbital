CREATE DATABASE tasks;

CREATE TABLE todo(
    user_id uuid NOT NULL,
    todo_id SERIAL PRIMARY KEY, 
    description VARCHAR(255),
    completed boolean
);

CREATE TABLE subtasks(
    user_id uuid NOT NULL,
    subtask_id SERIAL PRIMARY KEY,
    task_id integer,
    description VARCHAR(255),
    completed boolean
);

CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  PRIMARY KEY(user_id)
);

--ALTER TABLE table
--DROP COLUMN column_name;

--INSERT INTO users (user_name, user_email, user_password)
--VALUES ('owen', 'owen@gmail.com', 'test123pw');
