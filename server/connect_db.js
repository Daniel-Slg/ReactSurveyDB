const Pool = require('pg').Pool;

let dbCredentials = {};

try {
    // Attempt to import credentials from the local file
    dbCredentials = require('./passwd.js');
  } catch (error) {
    console.error('Error loading database credentials. Ensure that "passwd.js" exists in the Server folder.');
    process.exit(1); 
  }


const pool = new Pool({
    user: dbCredentials.user,
    password: dbCredentials.password, 
    host: 'localhost',
    port: 5432,
    database: 'surveys_db'
});

module.exports = pool; // Export the pool object for use in other files