const pool = require('../connect_db');

// Get all answers for a response
const getAnswers = async (response_id) => {
    const result = await pool.query('SELECT * FROM answers WHERE response_id = $1', [response_id]);
    return result.rows;
};

// Create a new answer for a question
const createAnswer = async (response_id, question_id, answer_text, choice_id) => {
    const result = await pool.query(
        'INSERT INTO answers (response_id, question_id, answer_text, choice_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [response_id, question_id, answer_text, choice_id]
    );
    return result.rows[0];
};

// Delete an answer
const deleteAnswer = async (id) => {
    await pool.query('DELETE FROM answers WHERE id = $1', [id]);
};

module.exports = { getAnswers, createAnswer, deleteAnswer };
