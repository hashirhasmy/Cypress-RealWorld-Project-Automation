const mysql = require('mysql');

function getConnection() {
  const dbConfig = {
    host: '',
    user: 'hashir',
    password: '',
    database: 'primary',
    port: 3306,
  };

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      throw err;
    }
    console.log('Connected to the database.');
  });

  return connection;
}

// Usage example:
const dbConnection = getConnection();


// You can now use dbConnection to execute SQL queries and interact with your MySQL database.
// For example:
// dbConnection.query('SELECT * FROM your_table', (error, results, fields) => {
//   if (error) throw error;
//   console.log('Query results:', results);
// });

// Don't forget to close the connection when you're done with it:
// dbConnection.end();
