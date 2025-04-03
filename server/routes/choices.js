const express = require('express');
const { getChoices, createChoice, deleteChoice } = require('../models/choices');
const router = express.Router();

// Get all choices for a question
router.get('/:question_id', async (req, res) => {
    const { question_id } = req.params;
    try {
        const choices = await getChoices(question_id);
        res.json(choices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new choice for a question
router.post('/:question_id', async (req, res) => {
    const { question_id } = req.params;
    const { choice_text } = req.body;
    try {
        const newChoice = await createChoice(question_id, choice_text);
        res.status(201).json(newChoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a choice
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteChoice(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
