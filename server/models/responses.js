const pool = require('../connect_db');

// Get all responses for a survey
const getResponses = async (survey_id) => {
    const result = await pool.query('SELECT * FROM responses WHERE survey_id = $1', [survey_id]);
    return result.rows;
};

// Create a new response for a user and survey
const createResponse = async (user_id, survey_id) => {
    const result = await pool.query(
        'INSERT INTO responses (user_id, survey_id) VALUES ($1, $2) RETURNING *',
        [user_id, survey_id]
    );
    return result.rows[0];
};

// Delete a response
const deleteResponse = async (id) => {
    await pool.query('DELETE FROM responses WHERE id = $1', [id]);
};

module.exports = { getResponses, createResponse, deleteResponse };
