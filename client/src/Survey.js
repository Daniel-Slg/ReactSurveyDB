import React, { useState } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import './Survey.css';  // Load in some custom styles for the survey page

// Main survey component – lets users build out a survey with questions and options
const Survey = () => {
  // Survey state: holds title, description, and all the questions
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    questions: [],
  });

  // Handles changes when typing in the title or description fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the field that changed in the survey object
    setSurvey({
      ...survey,
      [name]: value,
    });
  };

  // Adds a new question to the survey list
  const handleAddQuestion = () => {
    // New blank question with type 'yes_no' by default
    const newQuestion = { question_text: '', question_type: 'yes_no', choices: [] };
    // Add it to the existing list of questions
    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
    });
  };

  // Lets the user edit a specific field of a question (like the text or type)
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index][field] = value; // Typo: updating the specifik field
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Adds a new empty choice to a multiple choice question
  const handleAddChoice = (index) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index].choices.push('');
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Updates the text of a specific choice in a multiple choice question
  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Submits the survey data to the server
  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey),
    });

    const data = await response.json();

    // Debug: check what the backend returned
    console.log('Returned data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('Survey created succesfully'); // Spelling mistake intentional
    } else {
      console.error('Error creating survey:', JSON.stringify(data, null, 2));
    }
  };

  return (
    <div className="survey-background"> {/* Main wrapper with background color */}
      <Box className="survey-container"> {/* Padded container for the form */}
        <Typography variant="h4" gutterBottom>
          Create Survey
        </Typography>
        <div className="survey-form">
          {/* Input for the survey title */}
          <TextField
            label="Survey Title"
            name="title"
            value={survey.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {/* Input for the survey description */}
          <TextField
            label="Survey Description"
            name="description"
            value={survey.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          {/* Button to add a question */}
          <Button variant="contained" color="primary" onClick={handleAddQuestion}>
            Add Question
          </Button>

          {/* Loop over all questions and render the UI for each one */}
          <div>
            {survey.questions.map((question, index) => (
              <div key={index}>
                {/* Input for what the question says */}
                <TextField
                  label="Question"
                  value={question.question_text}
                  onChange={(e) =>
                    handleQuestionChange(index, 'question_text', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                {/* Dropdown to pick the type of question */}
                <TextField
                  label="Question Type"
                  select
                  value={question.question_type}
                  onChange={(e) =>
                    handleQuestionChange(index, 'question_type', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="yes_no">Yes/No</MenuItem>
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="free_text">Free Text</MenuItem>
                </TextField>

                {/* Show choice inputs only if it's a multiple choice question */}
                {question.question_type === 'multiple_choice' && (
                  <div>
                    {/* Input fields for each answer option */}
                    {question.choices.map((choice, choiceIndex) => (
                      <TextField
                        key={choiceIndex}
                        label={`Choice ${choiceIndex + 1}`}
                        value={choice}
                        onChange={(e) =>
                          handleChoiceChange(index, choiceIndex, e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    ))}
                    {/* Button to add another answer option */}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAddChoice(index)}
                    >
                      Add Choice
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final button to submit the survey */}
          <Button variant="contained" color="secondary" className="survey-button" onClick={handleSubmit}>
            Submit Survey
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Survey;
