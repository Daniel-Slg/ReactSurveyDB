const pool = require('../connect_db');

// Fetch all surveys
const getSurveys = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, title FROM surveys');
    return result.rows;
  } catch (err) {
    throw new Error('Error fetching surveys: ' + err.message);
  } finally {
    client.release();
  }
};

//Fetch a specific survey and its questions based on ID
const getSurveyById = async (surveyId) => {
  const client = await pool.connect();
  try {
    const surveyResult = await client.query('SELECT * FROM surveys WHERE id = $1', [surveyId]);
    if (surveyResult.rows.length === 0) {
      return null;
    }

    const survey = surveyResult.rows[0];
    const questionsResult = await client.query('SELECT * FROM questions WHERE survey_id = $1', [surveyId]);

    const questionIds = questionsResult.rows.map(q => q.id);
    const choicesResult = await client.query(
      'SELECT * FROM choices WHERE question_id = ANY($1)',
      [questionIds]
    );
    // TODO allow for no options
    const questionsWithChoices = questionsResult.rows.map(question => {
      const choices = question.question_type === 'multiple_choice'
        ? choicesResult.rows
            .filter(choice => choice.question_id === question.id)
            .map(choice => ({
              id: choice.id,
              choice_text: choice.choice_text
            }))
        : [];

      return {
        ...question,
        choices
      };
    });

    survey.questions = questionsWithChoices;
    return survey;
  } catch (err) {
    throw new Error('Error fetching survey by ID: ' + err.message);
  } finally {
    client.release();
  }
};

// Create a new survey with questions and choices
const createSurveyWithQuestions = async (title, description, created_by, questions) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO surveys (title, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      [title, description, created_by]
    );
    const surveyId = result.rows[0].id;

    for (let question of questions) {
      const { question_text, question_type, choices } = question;

      const questionResult = await client.query(
        'INSERT INTO questions (survey_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING id',
        [surveyId, question_text, question_type]
      );
      const questionId = questionResult.rows[0].id;

      // Insert choices for multiple-choice questions
      if (question_type === 'multiple_choice' && choices) {
        for (let choice of choices) {
          await client.query(
            'INSERT INTO choices (question_id, choice_text) VALUES ($1, $2)',
            [questionId, choice]
          );
        }
      }

      await client.query(
        'INSERT INTO answers (response_id, question_id, answer_text) VALUES (NULL, $1, NULL)',
        [questionId]
      );
    }

    // Fetch the full survey with questions and choices
    const survey = await client.query('SELECT * FROM surveys WHERE id = $1', [surveyId]);
    const questionsResult = await client.query('SELECT * FROM questions WHERE survey_id = $1', [surveyId]);
    const choicesResult = await client.query(
      'SELECT * FROM choices WHERE question_id IN (SELECT id FROM questions WHERE survey_id = $1)',
      [surveyId]
    );

    const fullSurvey = {
      ...survey.rows[0],
      questions: questionsResult.rows.map(question => ({
        ...question,
        choices: choicesResult.rows
          .filter(choice => choice.question_id === question.id)
          .map(choice => ({
            id: choice.id,
            choice_text: choice.choice_text
          }))
      }))
    };

    await client.query('COMMIT');
    return fullSurvey;
  } catch (err) {
    await client.query('ROLLBACK');
    throw new Error(err.message);
  } finally {
    client.release();
  }
};

module.exports = {
  getSurveys,
  getSurveyById,
  createSurveyWithQuestions
};
