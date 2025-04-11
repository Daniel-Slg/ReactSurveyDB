const express = require('express');
const { getQuestions, createQuestion, updateQuestion, deleteQuestion, getQuestionById} = require('../models/questions');
const router = express.Router();

// Get all questions for a survey
router.get('/:survey_id', async (req, res) => {
    const { survey_id } = req.params;
    try {
        const questions = await getQuestions(survey_id);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get a single question by question ID with no need of survey
router.get('/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const question = await getQuestionById(id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Create a new question
router.post('/:survey_id', async (req, res) => {
    const { survey_id } = req.params;
    const { question_text, question_type } = req.body;
    try {
        const newQuestion = await createQuestion(survey_id, question_text, question_type);
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a question
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { question_text, question_type } = req.body;
    try {
        const updatedQuestion = await updateQuestion(id, question_text, question_type);
        res.json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a question
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteQuestion(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
