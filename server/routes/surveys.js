const express = require('express');
const { getSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey } = require('../models/surveys');
const router = express.Router();

// Get all surveys
router.get('/', async (req, res) => {
    try {
        const surveys = await getSurveys();
        res.json(surveys);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific survey by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const survey = await getSurveyById(id);
        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }
        res.json(survey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new survey
router.post('/', async (req, res) => {
    const { title, description, created_by } = req.body;
    try {
        const newSurvey = await createSurvey(title, description, created_by);
        res.status(201).json(newSurvey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing survey
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, created_by } = req.body;
    try {
        const updatedSurvey = await updateSurvey(id, title, description, created_by);
        res.json(updatedSurvey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a survey
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteSurvey(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
