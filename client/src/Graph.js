import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Legend as RechartsLegend } from 'recharts';
import './Graph.css';  // Import custom styles for the survey component

const Graphs = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [surveyId, setSurveyId] = useState(null); // Initially null until surveys are fetched
  const [surveys, setSurveys] = useState([]); // To hold the list of available surveys

  // Fetch the list of surveys when the component mounts
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/surveys'); // Adjust the endpoint to fetch all surveys
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // Get the list of surveys
        setSurveys(data);
        if (data.length > 0) {
          setSurveyId(data[0].id); // Set the default survey to the first one
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, []);

  // Fetch survey data for the selected surveyId
  useEffect(() => {
    if (surveyId !== null) {
      const fetchSurveyData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/analytics/survey/${surveyId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json(); // Parse the JSON response
          setSurveyData(data);
        } catch (error) {
          console.error('Error fetching survey data:', error);
        }
      };

      fetchSurveyData();
    }
  }, [surveyId]);

  // Prepare data for each question
  const prepareChartDataForQuestion = (questionId, type) => {
    if (!surveyData || !surveyData.responses) return [];

    const answerCounts = {};
    surveyData.responses.forEach(response => {
      const answer = response.answers.find(answer => answer.question_id === questionId);
      if (answer) {
        if (answer.answer_text) {
          answerCounts[answer.answer_text] = (answerCounts[answer.answer_text] || 0) + 1;
        }
        if (answer.choice_id) {
          answerCounts[answer.choice_id] = (answerCounts[answer.choice_id] || 0) + 1;
        }
      }
    });

    if (type === 'yesno') {
      return [
        { name: 'Yes', count: answerCounts['yes'] || 0 },
        { name: 'No', count: answerCounts['no'] || 0 }
      ];
    }

    return Object.keys(answerCounts).map(answer => ({
      name: answer,
      count: answerCounts[answer],
    }));
  };

  // Prepare pie chart data for multiple-choice questions with text options
  const preparePieChartDataForQuestion = (questionId) => {
    if (!surveyData || !surveyData.responses) return [];

    const choiceCounts = {};
    surveyData.responses.forEach(response => {
      const answer = response.answers.find(answer => answer.question_id === questionId);
      if (answer && answer.choice_id) {
        choiceCounts[answer.choice_id] = (choiceCounts[answer.choice_id] || 0) + 1;
      }
    });

    const question = surveyData.questions.find(q => q.id === questionId);
    const choices = question ? question.choices : [];

    return choices.map(choice => ({
      name: choice.text,
      count: choiceCounts[choice.id] || 0,
    }));
  };

  // Define a fixed color palette with 10 colors
  const colorPalette = [
    '#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#ffcc00',
    '#00bfff', '#8a2be2', '#8b0000', '#32cd32', '#20b2aa'
  ];

  return (
    <div>
      <h2>Survey Results</h2>

      {/* Dropdown to select the survey dynamically */}
      <select value={surveyId} onChange={(e) => setSurveyId(Number(e.target.value))}>
        {surveys.map((survey) => {
          console.log(survey); // Log the survey object to the console to inspect its structure
          return (
            <option key={survey.id} value={survey.id}>
              {survey.title || `Survey ${survey.id}`}  {/* Use `survey.title` or fallback */}
            </option>
          );
        })}
      </select>

      {surveyData ? (
        <div>
          {surveyData.questions.map((question) => (
            <div key={question.id}>
              <h3>{question.text}</h3>
              {question.type === 'yes_no' ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={prepareChartDataForQuestion(question.id, 'yesno')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : question.type === 'multiple_choice' ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={preparePieChartDataForQuestion(question.id)}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                    >
                      {preparePieChartDataForQuestion(question.id).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorPalette[index % 10]} />
                      ))}
                    </Pie>
                    <RechartsLegend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      payload={preparePieChartDataForQuestion(question.id).map((entry, index) => ({
                        value: `${entry.name} (${entry.count})`,  // Display both the option text and the count
                        type: 'square',
                        color: colorPalette[index % 10],
                      }))} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : question.type === 'free_text' ? (
                <div style={{ maxHeight: '300px', overflowY: 'scroll', marginTop: '20px' }}>
                  {surveyData.responses.map((response, idx) => {
                    const answer = response.answers.find(a => a.question_id === question.id);
                    return answer && answer.answer_text ? (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#333', // Dark background
                          color: '#fff', // White text
                          padding: '10px',
                          marginBottom: '10px',
                          borderRadius: '15px',
                          display: 'inline-block',
                          maxWidth: '80%',
                          wordWrap: 'break-word',
                        }}
                      >
                        {answer.answer_text}
                      </div>
                    ) : null;
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading survey data...</p>
      )}
    </div>
  );
};

export default Graphs;
