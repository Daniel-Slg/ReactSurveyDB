const pool = require('../connect_db');

// Get all answers for a response
const getAnswers = async (response_id) => {
    const result = await pool.query('SELECT * FROM answers WHERE response_id = $1', [response_id]);
    return result.rows;
};

const createAnswer = async (response_id, question_id, answer_text, choice_id, client) => {
    if (!response_id || !question_id) {
        throw new Error('Response ID and Question ID are required');
    }

    if (choice_id) {
        const choiceResult = await client.query('SELECT * FROM choices WHERE id = $1', [choice_id]);
        if (choiceResult.rowCount === 0) {
            throw new Error('Invalid choice ID');
        }
    }

    // Insert answer into the database using the provided client connection
    const result = await client.query(
        'INSERT INTO answers (response_id, question_id, answer_text, choice_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [response_id, question_id, answer_text, choice_id]
    );
    return result.rows[0];
};

const deleteAnswer = async (id) => {
    await pool.query('DELETE FROM answers WHERE id = $1', [id]);
};

module.exports = { getAnswers, createAnswer, deleteAnswer };
