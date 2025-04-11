const pool = require('../connect_db');

// Get all responses for a survey
const getResponses = async (survey_id) => {
    const result = await pool.query('SELECT * FROM responses WHERE survey_id = $1', [survey_id]);
    return result.rows;
};

// Create a new response for a user and survey
const createResponse = async (user_id, survey_id, client = pool) => {
    if (!user_id || !survey_id) {
        throw new Error('User ID and Survey ID are required');
    }

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (userResult.rowCount === 0) {
        throw new Error('User not found');
    }

    const surveyResult = await pool.query('SELECT * FROM surveys WHERE id = $1', [survey_id]);
    if (surveyResult.rowCount === 0) {
        throw new Error('Survey not found');
    }

    const result = await client.query(
        'INSERT INTO responses (user_id, survey_id) VALUES ($1, $2) RETURNING *',
        [user_id, survey_id]
    );
    return result.rows[0];
};

// Delete a response
const deleteResponse = async (id) => {
    const result = await pool.query('SELECT * FROM responses WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error('Response not found');
    }

    await pool.query('DELETE FROM responses WHERE id = $1', [id]);
};

module.exports = { getResponses, createResponse, deleteResponse };
