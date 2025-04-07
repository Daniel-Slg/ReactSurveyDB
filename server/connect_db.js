const { Pool } = require('pg');


console.log('Database Host:', process.env.DB_HOST);


const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres', // Use "postgres" as default host, not localhost
  database: process.env.DB_NAME || 'surveys_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;


// const Pool = require('pg').Pool;

// let dbCredentials = {};

// try {
//     // Attempt to import credentials from the local file
//     dbCredentials = require('./passwd.js');
//   } catch (error) {
//     console.error('Error loading database credentials. Ensure that "passwd.js" exists in the Server folder.');
//     process.exit(1); 
//   }


// const pool = new Pool({
//     user: dbCredentials.user,
//     password: dbCredentials.password, 
//     host: 'localhost',
//     port: 5432,
//     database: 'surveys_db'
// });

// module.exports = pool; // Export the pool object for use in other files