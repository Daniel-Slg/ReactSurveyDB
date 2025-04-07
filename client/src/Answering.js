import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import './Answering.css';

const Answering = () => {
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);  // New state to handle errors

  // Fetch all surveys when the component is mounted
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/surveys');
        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        setError('Could not fetch anything X_X');  // Set error message if fetch fails
      }
    };
    fetchSurveys();
  }, []);

  // Handle selection of a survey to answer
  const handleSurveySelect = async (surveyId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/surveys/${surveyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch survey details');
      }
      const data = await response.json();
      console.log('Fetched Survey Data:', data); // Debugging
      setCurrentSurvey(data);
      setAnswers(data.questions ? data.questions.map(() => '') : []);  // Initialize answers array if questions exist
    } catch (err) {
      console.error('Error fetching survey:', err.message);
    }
  };

  // Handle changes to answers
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle submission of answers
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_id: currentSurvey.id,
          answers: answers,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      const data = await response.json();
      console.log('Answers submitted:', data);
    } catch (error) {
      setError('Could not submit answers X_X');  // Set error message if submission fails
    }
  };

  return (
    <div className="answering-background">
      <Box className="answering-container">
        <Typography variant="h4" gutterBottom>Answer Surveys</Typography>

        {error && (
          <Typography variant="h5" color="error">
            {error}  {/* Show error message if fetch fails */}
          </Typography>
        )}

        {!error && (
          <div>
            <Typography variant="h6">Select a Survey</Typography>
            <div>
              {surveys.map((survey) => (
                <Button key={survey.id} variant="outlined" onClick={() => handleSurveySelect(survey.id)}>
                  {survey.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentSurvey && !error && (
          <div>
            <Typography variant="h5">{currentSurvey.title}</Typography>
            <Typography>{currentSurvey.description}</Typography>

            {currentSurvey.questions && Array.isArray(currentSurvey.questions) && currentSurvey.questions.length > 0 ? (
              currentSurvey.questions.map((question, index) => (
                <div key={index}>
                  <Typography variant="h6">{question.question_text}</Typography>
                  {question.question_type === 'yes_no' && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Answer</InputLabel>
                      <Select
                        value={answers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {question.question_type === 'multiple_choice' && (
                    <div>
                      {question.choices.map((choice, choiceIndex) => (
                        <Button
                          key={choiceIndex}
                          variant={answers[index] === choice ? 'contained' : 'outlined'}
                          onClick={() => handleAnswerChange(index, choice)}
                        >
                          {choice}
                        </Button>
                      ))}
                    </div>
                  )}

                  {question.question_type === 'free_text' && (
                    <TextField
                      label="Your Answer"
                      value={answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  )}
                </div>
              ))
            ) : (
              <Typography variant="h6" color="error">No questions available for this survey.</Typography>
            )}

            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              Submit Answers
            </Button>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Answering;
