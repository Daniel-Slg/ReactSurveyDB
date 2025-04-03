const express = require('express');
const { getAnswers, createAnswer, deleteAnswer } = require('../models/answers');
const router = express.Router();

// Get all answers for a response
router.get('/:response_id', async (req, res) => {
    const { response_id } = req.params;
    try {
        const answers = await getAnswers(response_id);
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new answer
router.post('/:response_id', async (req, res) => {
    const { response_id } = req.params;
    const { question_id, answer_text, choice_id } = req.body;
    try {
        const newAnswer = await createAnswer(response_id, question_id, answer_text, choice_id);
        res.status(201).json(newAnswer);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
