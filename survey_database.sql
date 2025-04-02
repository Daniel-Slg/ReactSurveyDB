CREATE DATABASE survey_db;   

    -- Users table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(10) CHECK (role IN ('admin', 'user')) NOT NULL
    );

    -- Surveys table
    CREATE TABLE surveys (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Questions table
    CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        survey_id INT REFERENCES surveys(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(20) CHECK (question_type IN ('yes_no', 'multiple_choice', 'free_text')) NOT NULL
    );

    -- Multiple Choices table 
    CREATE TABLE choices (
        id SERIAL PRIMARY KEY,
        question_id INT REFERENCES questions(id) ON DELETE CASCADE,
        choice_text TEXT NOT NULL
    );

    -- User Responses table 
    CREATE TABLE responses (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        survey_id INT REFERENCES surveys(id) ON DELETE CASCADE,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Answers table 
    CREATE TABLE answers (
        id SERIAL PRIMARY KEY,
        response_id INT REFERENCES responses(id) ON DELETE CASCADE,
        question_id INT REFERENCES questions(id) ON DELETE CASCADE,
        answer_text TEXT, -- Free text answers
        choice_id INT REFERENCES choices(id) -- Only used for multiple-choice
    );
