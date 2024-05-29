const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS with specific options
app.use(cors());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'node-complete'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON requests
app.use(express.json());

// POST route to insert data into the message table
app.post('/messages', (req, res) => {
  const { message } = req.body;
  const sql = 'INSERT INTO message (message) VALUES (?)';
  connection.query(sql, [message], (err, result) => {
    if (err) {
      console.error('Error inserting data into message table:', err);
      res.status(500).send('Error inserting data into message table');
      return;
    }
    console.log('Data inserted into message table');
    res.status(201).send('Data inserted into message table');
  });
});

// GET route to retrieve all data from the message table
app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM message';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data from message table:', err);
      res.status(500).send('Error retrieving data from message table');
      return;
    }
    console.log('Data retrieved from message table:', results);
    res.status(200).json(results);
  });
});

// Close MySQL database connection when the server shuts down
process.on('SIGINT', () => {
  console.log('Closing MySQL database connection');
  connection.end();
  process.exit();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
