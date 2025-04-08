import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import './Answering.css';

const Answering = () => {
  const [surveys, setSurveys] = useState([]);  // Store all surveys
  const [currentSurvey, setCurrentSurvey] = useState(null);  // Store the current selected survey
  const [answers, setAnswers] = useState([]);  // Store the user's answers
  const [error, setError] = useState(null);  // Store errors if fetching fails

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
        setError('Could not fetch surveys X_X');  // Error handling
      }
    };
    fetchSurveys();
  }, []);

  // Handle survey selection (fetch the survey details and initialize answers)
  const handleSurveySelect = async (surveyId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/surveys/${surveyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch survey details');
      }
      const data = await response.json();
      console.log('Fetched Survey Data:', data);  // Debugging

      setCurrentSurvey(data);
      // Initialize answers array with empty strings (or null for multiple-choice) based on the number of questions
      setAnswers(data.questions ? data.questions.map(() => ({
        question_id: null,  // Will be populated with the actual question ID
        answer_text: '',     // Default to empty for text-based answers
        choice_id: null,     // Default to null for multiple-choice
      })) : []);
    } catch (err) {
      console.error('Error fetching survey:', err.message);
    }
  };

  // Handle changes to answers (updates the correct question's answer)
  const handleAnswerChange = (index, value, questionType) => {
    const updatedAnswers = [...answers];

    // Update the answer object for the specific question
    const updatedAnswer = {
      ...updatedAnswers[index],  // Keep the other properties unchanged
      question_id: currentSurvey.questions[index].id,  // Set the correct question ID
      answer_text: questionType === 'free_text' ? value : '',  // Only for free text questions
      choice_id: questionType === 'multiple_choice' ? value : null,  // Only for multiple-choice questions
    };

    updatedAnswers[index] = updatedAnswer;
    setAnswers(updatedAnswers);
  };

  // Handle submission of answers
  const handleSubmit = async () => {
    try {
      // Prepare answers to be sent in the correct format
      const formattedAnswers = answers.map(answer => ({
        question_id: answer.question_id,  // Question ID
        answer_text: answer.answer_text,  // Free-text answer (null for choices)
        choice_id: answer.choice_id || null,  // Choice ID (null for text questions)
      }));

      console.log('Submitting answers:', {
        survey_id: currentSurvey.id,
        answers: formattedAnswers,  // Send the formatted answers
      });

      const response = await fetch(`http://localhost:5000/api/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_id: currentSurvey.id,
          answers: formattedAnswers,  // Send the correctly formatted answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const data = await response.json();
      console.log('Answers submitted:', data);  // Log the successful response

    } catch (error) {
      console.error('Error submitting answers:', error);  // Log any error
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
                  {/* Handle Yes/No questions */}
                  {question.question_type === 'yes_no' && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Answer</InputLabel>
                      <Select
                        value={answers[index].choice_id}
                        onChange={(e) => handleAnswerChange(index, e.target.value, 'multiple_choice')}
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {/* Handle Multiple-Choice questions */}
                  {question.question_type === 'multiple_choice' && (
                    <div>
                      {question.choices.map((choice, choiceIndex) => (
                        <Button
                          key={choiceIndex}
                          variant={answers[index].choice_id === choice.id ? 'contained' : 'outlined'}
                          onClick={() => handleAnswerChange(index, choice.id, 'multiple_choice')}
                        >
                          {choice.choice_text}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Handle Free-text questions */}
                  {question.question_type === 'free_text' && (
                    <TextField
                      label="Your Answer"
                      value={answers[index].answer_text}
                      onChange={(e) => handleAnswerChange(index, e.target.value, 'free_text')}
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
