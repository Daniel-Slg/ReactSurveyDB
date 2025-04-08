const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./connect_db'); 
const loginRouter = require('./routes/login'); // Import the login route
const usersRouter = require('./routes/users');  // Import the users route
const surveysRouter = require('./routes/surveys');  // Import the surveys route
const questionsRouter = require('./routes/questions');  // Import the questions route
const responsesRouter = require('./routes/responses');  // Import the responses route
const answersRouter = require('./routes/answers');  // Import the answers route
const choicesRouter = require('./routes/choices');  // Import the choices route


console.log('Server is starting...');

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
// Use the login route
app.use('/api', loginRouter); 
// Use the users routes
app.use('/api/users', usersRouter);
// Use the surveys routes
app.use('/api/surveys', surveysRouter);
// Use the questions routes
app.use('/api/questions', questionsRouter);
// Use the responses routes
app.use('/api/responses', responsesRouter);
// Use the answers routes
app.use('/api/answers', answersRouter);
// Use the choices routes
app.use('/api/choices', choicesRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
