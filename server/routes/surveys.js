const express = require('express');
const { getSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey, createSurveyWithQuestions } = require('../models/surveys');
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

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const survey = await getSurveyById(id); // Deine Funktion zum Abrufen der Umfrage nach ID
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.json(survey);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// Create a new survey (with questions)
router.post('/', async (req, res) => {
    const { title, description, created_by, questions } = req.body;

    // Ensure that the survey contains questions
    if (!questions || questions.length === 0) {
        return res.status(400).json({ error: "Survey must have at least one question." });
    }

    try {
        // Call the model function to create the survey along with questions and choices
        const newSurvey = await createSurveyWithQuestions(title, description, created_by, questions);
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
