const pool = require('../connect_db');

// Get all questions for a survey
const getQuestions = async (survey_id) => {
    const result = await pool.query('SELECT * FROM questions WHERE survey_id = $1', [survey_id]);
    return result.rows;
};

const getQuestionById = async (id) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM questions WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error('Error fetching question by ID: ' + err.message);
    } finally {
      client.release();
    }
  };

  
// Create a new question for a survey
const createQuestion = async (survey_id, question_text, question_type) => {
    const result = await pool.query(
        'INSERT INTO questions (survey_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING *',
        [survey_id, question_text, question_type]
    );
    return result.rows[0];
};

// Update a question
const updateQuestion = async (id, question_text, question_type) => {
    const result = await pool.query(
        'UPDATE questions SET question_text = $1, question_type = $2 WHERE id = $3 RETURNING *',
        [question_text, question_type, id]
    );
    return result.rows[0];
};

// Delete a question
const deleteQuestion = async (id) => {
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
};

  
module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
  };
