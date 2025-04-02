const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./connect_db'); 

'npx nodemon index.js'
console.log('Server is starting...');

//middleware
app.use(cors());
app.use(express.json()); 


// Routes

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
