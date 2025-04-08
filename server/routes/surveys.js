const express = require('express');
const router = express.Router();
const {
  getSurveys,
  getSurveyById,
  createSurveyWithQuestions
} = require('../models/surveys');

// Route: Get all surveys
router.get('/', async (req, res) => {
  try {
    const surveys = await getSurveys();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Get a specific survey by ID
router.get('/:id', async (req, res) => {
  const surveyId = req.params.id;
  try {
    const survey = await getSurveyById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optional: POST route to create surveys (if needed)
router.post('/', async (req, res) => {
  const { title, description, created_by, questions } = req.body;
  try {
    const result = await createSurveyWithQuestions(title, description, created_by, questions);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
