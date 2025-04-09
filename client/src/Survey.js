import React, { useState } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import './Survey.css';  // Import custom styles for the survey component

// Survey component: allows users to create a survey with questions and choices
const Survey = () => {
  // Define the survey state with title, description, and an array of questions
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    questions: [],
  });

  // Handle changes for survey title and description inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the corresponding field in the survey state
    setSurvey({
      ...survey,
      [name]: value,
    });
  };

  // Add a new question to the survey
  const handleAddQuestion = () => {
    // Create a new question with default values and an empty choices array
    const newQuestion = { question_text: '', question_type: 'yes_no', choices: [] };
    // Update survey state by appending the new question to the questions array
    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
    });
  };

  // Update a specific field of a question in the survey based on its index
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    // Modify the field (e.g., question_text or question_type) of the question at the given index
    updatedQuestions[index][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Add a new (empty) choice for a multiple-choice question
  const handleAddChoice = (index) => {
    const updatedQuestions = [...survey.questions];
    // Append an empty string to the choices array for the specific question
    updatedQuestions[index].choices.push('');
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Update a specific choice for a multiple-choice question
  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...survey.questions];
    // Update the choice at the specified index
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  // Handle the submission of the survey form
  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey),
    });
  
    const data = await response.json();
  
    // Log the full survey data
    console.log('Returned data:', JSON.stringify(data, null, 2));
  
    if (response.ok) {
      console.log('Survey created successfully');
    } else {
      console.error('Error creating survey:', JSON.stringify(data, null, 2));
    }
  };
  

  return (
    <div className="survey-background"> {/* Container with background style from Survey.css */}
      <Box className="survey-container"> {/* Container for the survey form with padding and styling */}
        <Typography variant="h4" gutterBottom>
          Create Survey
        </Typography>
        <div className="survey-form">
          {/* Input for Survey Title */}
          <TextField
            label="Survey Title"
            name="title"
            value={survey.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {/* Input for Survey Description */}
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
          {/* Button to add a new question */}
          <Button variant="contained" color="primary" onClick={handleAddQuestion}>
            Add Question
          </Button>

          {/* Render each question in the survey */}
          <div>
            {survey.questions.map((question, index) => (
              <div key={index}>
                {/* Input for the question text */}
                <TextField
                  label="Question"
                  value={question.question_text}
                  onChange={(e) =>
                    handleQuestionChange(index, 'question_text', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                {/* Dropdown to select the question type */}
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

                {/* If the question type is 'multiple_choice', render inputs for choices */}
                {question.question_type === 'multiple_choice' && (
                  <div>
                    {/* Map over the choices array to create an input for each choice */}
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
                    {/* Button to add a new choice */}
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

          {/* Button to submit the entire survey */}
          <Button variant="contained" color="secondary" className="survey-button" onClick={handleSubmit}>
            Submit Survey
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Survey;
