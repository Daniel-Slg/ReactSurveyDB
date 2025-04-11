const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./connect_db'); 
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const surveysRouter = require('./routes/surveys');
const questionsRouter = require('./routes/questions');
const responsesRouter = require('./routes/responses');
const answersRouter = require('./routes/answers');
const choicesRouter = require('./routes/choices');
const analyticsRouter = require('./routes/analytics');

console.log('Server is starting...');

// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/surveys', surveysRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/responses', responsesRouter);
app.use('/api/answers', answersRouter);
app.use('/api/choices', choicesRouter);
app.use('/api/analytics', analyticsRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
