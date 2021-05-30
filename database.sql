CREATE DATABASE tasks;

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY, 
    description VARCHAR(255)
);

CREATE TABLE subtasks(
    subtask_id SERIAL PRIMARY KEY,
    task_id integer,
    description VARCHAR(255)
);