CREATE DATABASE tasks;

CREATE TABLE todo(
    user_id VARCHAR NOT NULL,
    todo_id SERIAL PRIMARY KEY, 
    description VARCHAR(255),
    deadline DATE,
    todoDate DATE,
    priority integer,
    progress integer,
    completed boolean
);

CREATE TABLE subtasks(
    user_id VARCHAR NOT NULL,
    subtask_id SERIAL PRIMARY KEY,
    todo_id integer,
    description VARCHAR(255),
    completed boolean
);

CREATE TABLE properties(
  user_id VARCHAR(255),
  property_name VARCHAR(255)
);

--ALTER TABLE table
--DROP COLUMN column_name;

--INSERT INTO users (user_name, user_email, user_password)
--VALUES ('owen', 'owen@gmail.com', 'test123pw');
