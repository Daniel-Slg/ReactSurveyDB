const express = require('express');
const router = express.Router();
const pool = require('../connect_db');

// Function to get survey data (survey details)
const getSurveyData = async (surveyId) => {
    const client = await pool.connect();
    try {
        const surveyResult = await client.query(`
            SELECT id AS survey_id, title AS survey_title, description AS survey_description
            FROM surveys
            WHERE id = $1
        `, [surveyId]);

        if (surveyResult.rows.length === 0) {
            return { message: "Survey not found" };
        }

        const surveyData = surveyResult.rows[0];

        // Include also questions and results
        const questionResult = await client.query(`
            SELECT q.id AS question_id, q.question_text, q.question_type,
                   c.id AS choice_id, c.choice_text
            FROM questions q
            LEFT JOIN choices c ON q.id = c.question_id
            WHERE q.survey_id = $1
        `, [surveyId]);

        // grouping questions and choices
        const questions = [];
        questionResult.rows.forEach(row => {
            const question = questions.find(q => q.id === row.question_id);
            if (!question) {
                questions.push({
                    id: row.question_id,
                    text: row.question_text,
                    type: row.question_type,
                    choices: row.choice_id ? [{ id: row.choice_id, text: row.choice_text }] : []
                });
            } else if (row.choice_id) {
                question.choices.push({ id: row.choice_id, text: row.choice_text });
            }
        });

        // Responses and answers
        const responseResult = await client.query(`
            SELECT r.id AS response_id, r.user_id, r.submitted_at, 
                   a.answer_text, a.choice_id, q.id AS question_id
            FROM responses r
            LEFT JOIN answers a ON r.id = a.response_id
            LEFT JOIN questions q ON a.question_id = q.id
            WHERE r.survey_id = $1
        `, [surveyId]);

        // Group responses and answers by user
        const responses = [];
        responseResult.rows.forEach(row => {
            let response = responses.find(res => res.id === row.response_id);
            if (!response) {
                response = {
                    id: row.response_id,
                    user_id: row.user_id,
                    submitted_at: row.submitted_at,
                    answers: []
                };
                responses.push(response);
            }

            response.answers.push({
                question_id: row.question_id,
                answer_text: row.answer_text,
                choice_id: row.choice_id
            });
        });

        // Get all users who have responded to this survey
        const userResult = await client.query(`
            SELECT id AS user_id, username
            FROM users
            WHERE id IN (SELECT DISTINCT user_id FROM responses WHERE survey_id = $1)
        `, [surveyId]);

        const users = userResult.rows.reduce((acc, user) => {
            acc[user.user_id] = user.username;
            return acc;
        }, {});

        // Return the full survey data with questions, answers, and users
        return {
            survey: surveyData,
            questions: questions,
            responses: responses.map(response => ({
                ...response,
                user: users[response.user_id] || "Unknown"  // Default to "Unknown" if no username is found
            }))
        };

    } catch (err) {
        console.error('Error fetching survey data:', err);
        throw new Error('Error fetching survey data: ' + err.message);
    } finally {
        client.release();
    }
};

// Route to get survey information, including questions, choices, responses, and users
router.get('/survey/:survey_id', async (req, res) => {
    const surveyId = req.params.survey_id;

    try {
        // Get survey data (survey details, questions, answers, and responses)
        const surveyData = await getSurveyData(surveyId);

        // If the survey was not found
        if (!surveyData || surveyData.message) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        // Return the full survey data (survey details, questions, responses, etc.)
        return res.json(surveyData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
