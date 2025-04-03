const express = require('express');
const { getResponses, createResponse, deleteResponse } = require('../models/responses');
const router = express.Router();

// Get all responses for a survey
router.get('/:survey_id', async (req, res) => {
    const { survey_id } = req.params;
    try {
        const responses = await getResponses(survey_id);
        res.json(responses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new response
router.post('/:survey_id', async (req, res) => {
    const { survey_id } = req.params;
    const { user_id } = req.body;
    try {
        const newResponse = await createResponse(user_id, survey_id);
        res.status(201).json(newResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a response
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteResponse(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
