import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';
import './Answering.css';

const Answering = () => {
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/surveys');
        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }
        const data = await response.json();
        console.log('Fetched Surveys:', data); // ✅ LOG
        setSurveys(data);
      } catch (error) {
        setError('Could not fetch surveys X_X');
      }
    };
    fetchSurveys();
  }, []);

  const handleSurveySelect = async (surveyId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/surveys/${surveyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch survey details');
      }
      const data = await response.json();
      console.log('Fetched Survey Details:', data); // ✅ LOG

      setCurrentSurvey(data);
      setAnswers(
        data.questions
          ? data.questions.map(() => ({
              question_id: null,
              answer_text: '',
              choice_id: null,
            }))
          : []
      );
    } catch (err) {
      console.error('Error fetching survey:', err.message);
    }
  };

  const handleAnswerChange = (index, value, questionType) => {
    const updatedAnswers = [...answers];
    const updatedAnswer = {
      ...updatedAnswers[index],
      question_id: currentSurvey.questions[index].id,
      answer_text: questionType === 'free_text' || questionType === 'yes_no' ? value : '',
      choice_id: questionType === 'multiple_choice' ? value : null,
    };
    updatedAnswers[index] = updatedAnswer;
    setAnswers(updatedAnswers);
  };
  
  const handleSubmit = async () => {
    try {
      const formattedAnswers = answers.map((answer) => ({
        question_id: answer.question_id,
        answer_text: answer.answer_text || (answer.choice_id 
          ? currentSurvey.questions.find(q => q.id === answer.question_id)?.choices.find(c => c.id === answer.choice_id)?.choice_text 
          : null),  // Get the choice text for multiple-choice
        choice_id: answer.choice_id || null,
      }));
      const id = localStorage.getItem('userId')
      if (!id){
        const id = 22 //TODO better
      }
      const payload = {
        user_id: id,
        survey_id: currentSurvey.id,
        answers: formattedAnswers,
      };
  
      console.log('Submitting to backend:', payload); // ✅ LOG
  
      const response = await fetch('http://localhost:5000/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
  
      const result = await response.json();
      console.log('Submitted:', result); // ✅ LOG
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Could not submit answers X_X');
    }
  };
  
  return (
    <div className="answering-background">
      <Box className="answering-container">
        <Typography variant="h4" gutterBottom>Answer Surveys</Typography>

        {error && (
          <Typography variant="h5" color="error">
            {error}
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
                    <div>
                      {['Yes', 'No'].map((label, i) => {
                        const value = label.toLowerCase(); // 'yes' or 'no'
                        return (
                          <Button
                            key={value}
                            variant={answers[index].answer_text === value ? 'contained' : 'outlined'}
                            onClick={() =>
                              handleAnswerChange(index, value, 'free_text') // using answer_text for yes/no simplicity
                            }
                            style={{ margin: '5px', textTransform: 'none' }}
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  )}


                  {/* Handle Multiple-Choice questions */}
                  {question.question_type === 'multiple_choice' && question.choices?.length > 0 ? (
                    <div>
                      {question.choices.map((choice) => (
                        <Button
                          key={choice.id}
                          variant={answers[index].choice_id === choice.id ? 'contained' : 'outlined'}
                          onClick={() => handleAnswerChange(index, choice.id, 'multiple_choice')}
                          style={{ margin: '5px', textTransform: 'none' }}
                        >
                          {choice.choice_text}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    question.question_type === 'multiple_choice' && (
                      <Typography variant="body2" color="error">
                        No choices available for this question.
                      </Typography>
                    )
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
