const express = require('express');
const { getAnswers, createAnswer, deleteAnswer } = require('../models/answers');
const { createResponse } = require('../models/responses');
const pool = require('../connect_db');
const router = express.Router();

// Get all answers for a specific response
router.get('/:responseId', async (req, res) => {
    const { responseId } = req.params;
    try {
        const answers = await getAnswers(responseId);
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST endpoint for submitting answers
router.post('/', async (req, res) => {
  const { survey_id, answers } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create response record (using user_id = 1 for now)
    const response = await createResponse(1, survey_id, client);

    // Process each answer
    for (const answer of answers) {
      // Log each answer for debugging
      console.log('Processing answer:', answer);
      await createAnswer(
        response.id,
        answer.question_id,
        answer.answer_text,
        answer.choice_id,
        client
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, response_id: response.id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting answers:', error);  // Log the detailed error
    res.status(500).json({
      success: false,
      error: 'Failed to submit answers',
      details: error.message  // Send more detailed error info back
    });
  } finally {
    client.release();
  }
});

  
// Delete an answer
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteAnswer(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;