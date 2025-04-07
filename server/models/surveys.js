const pool = require('../connect_db');

// Fetch all surveys
const getSurveys = async () => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id, title FROM surveys'); // Select only the id and title
      return result.rows; // Return the rows (surveys) with actual titles
    } catch (err) {
      throw new Error('Error fetching surveys: ' + err.message);
    } finally {
      client.release();
    }
};

// Route to fetch a specific survey and its associated questions
app.get('/api/surveys/:id', async (req, res) => {
  const surveyId = req.params.id;
  try {
    const survey = await db.query('SELECT * FROM surveys WHERE id = $1', [surveyId]);

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Fetch related questions for this survey
    const questions = await db.query('SELECT * FROM questions WHERE survey_id = $1', [surveyId]);

    survey.questions = questions;  // Attach questions to the survey
    res.json(survey);  // Send the survey data, including questions
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch survey details' });
  }
});

// Your existing function (createSurveyWithQuestions)
const createSurveyWithQuestions = async (title, description, created_by, questions) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Start transaction

    // Insert the survey first
    const result = await client.query(
      'INSERT INTO surveys (title, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      [title, description, created_by]
    );
    const surveyId = result.rows[0].id;

    // Insert questions for the survey
    for (let question of questions) {
      const { question_text, question_type, choices } = question;

      // Insert the question
      const questionResult = await client.query(
        'INSERT INTO questions (survey_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING id',
        [surveyId, question_text, question_type]
      );
      const questionId = questionResult.rows[0].id;

      // Insert choices for multiple-choice questions
      if (question_type === 'multiple_choice') {
        for (let choice of choices) {
          await client.query(
            'INSERT INTO choices (question_id, choice_text) VALUES ($1, $2)',
            [questionId, choice]
          );
        }
      }

      // Optionally insert empty answers (if required)
      await client.query(
        'INSERT INTO answers (response_id, question_id, answer_text) VALUES (NULL, $1, NULL)',
        [questionId]
      );
    }

    await client.query('COMMIT'); // Commit transaction
    return { message: 'Survey created successfully with questions and choices' };
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback if any error occurs
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

module.exports = { getSurveys, getSurveyById, createSurveyWithQuestions };
