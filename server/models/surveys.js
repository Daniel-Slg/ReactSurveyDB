const pool = require('../connect_db');

// Get all surveys
const getSurveys = async () => {
    const result = await pool.query('SELECT * FROM surveys');
    return result.rows;
};

// Get a survey by ID
const getSurveyById = async (id) => {
    const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [id]);
    return result.rows[0];
};

// Create a new survey
const createSurvey = async (title, description, created_by) => {
    const result = await pool.query(
        'INSERT INTO surveys (title, description, created_by) VALUES ($1, $2, $3) RETURNING *',
        [title, description, created_by]
    );
    return result.rows[0];
};

// Update a survey
const updateSurvey = async (id, title, description, created_by) => {
    const result = await pool.query(
        'UPDATE surveys SET title = $1, description = $2, created_by = $3 WHERE id = $4 RETURNING *',
        [title, description, created_by, id]
    );
    return result.rows[0];
};

// Delete a survey
const deleteSurvey = async (id) => {
    await pool.query('DELETE FROM surveys WHERE id = $1', [id]);
};

module.exports = { getSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey };
