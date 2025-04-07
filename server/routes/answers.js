const express = require('express');
const { getAnswers, createAnswer, deleteAnswer } = require('../models/answers');
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

// Create a new answer for a specific question
router.post('/:responseId', async (req, res) => {
    const { responseId } = req.params;
    const { questionId, answerText, choiceId } = req.body;

    try {
        const newAnswer = await createAnswer(responseId, questionId, answerText, choiceId);
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
