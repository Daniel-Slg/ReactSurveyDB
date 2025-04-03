const pool = require('../connect_db');

// Get choices for a question
const getChoices = async (question_id) => {
    const result = await pool.query('SELECT * FROM choices WHERE question_id = $1', [question_id]);
    return result.rows;
};

// Create a new choice for a question
const createChoice = async (question_id, choice_text) => {
    const result = await pool.query(
        'INSERT INTO choices (question_id, choice_text) VALUES ($1, $2) RETURNING *',
        [question_id, choice_text]
    );
    return result.rows[0];
};

// Delete a choice
const deleteChoice = async (id) => {
    await pool.query('DELETE FROM choices WHERE id = $1', [id]);
};

module.exports = { getChoices, createChoice, deleteChoice };
