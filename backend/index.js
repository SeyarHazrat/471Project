// Import required libraries
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create an express app
const app = express();

// Middleware to handle JSON and CORS
app.use(express.json());
app.use(cors());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'Seyar456!', // Your MySQL password
  database: 'job_portal' // The name of your database
});

// Test the connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});
// Route handler
app.get('/', (req, res) => {
    res.send('Welcome to the Job Portal API!');
  });
  
// Get all jobs
app.get('/api/jobs', (req, res) => {
    const query = 'SELECT jobs.id, jobs.title, jobs.experience_level, companies.name as company_name FROM jobs JOIN companies ON jobs.company_id = companies.id';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).json({ error: 'Server error' });  // Send JSON response with error message
        }
        res.json(results);  // Ensure this is an array
    });
});





console.log("Server is starting...");

//Fetching and saving username
app.post('/api/user', (req, res) => {
    const { user_name } = req.body;
  
    const query = 'INSERT INTO users (user_name) VALUES (?)';
    db.query(query, [user_name], (err, result) => {
      if (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Server error');
      } else {
        // Fetch and send back the user's name
        const selectQuery = 'SELECT user_name FROM users WHERE id = ?';
        db.query(selectQuery, [result.insertId], (err, userResult) => {
          if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server error');
          } else {
            res.json(userResult[0]); // Send back the saved user's name
          }
        });
      }
    });
  });
//Register user
app.post('/api/register', (req, res) => {
    const { user_name, email, password, role } = req.body;
    const query = 'INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, ?)';
    
    db.query(query, [user_name, email, password, role], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send({ error: 'Registration failed' });
      } else {
        res.status(201).send({ message: 'User registered successfully' });
      }
    });
  });

//Login 
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?';
    
    db.query(query, [email, password, role], (err, results) => {
      if (err) {
        console.error('Error during login:', err);
        res.status(500).send({ error: 'Login failed' });
      } else if (results.length > 0) {
        res.send({ message: 'Login successful' });
      } else {
        res.status(401).send({ error: 'Invalid credentials' });
      }
    });
  });


  
// Set up the server to listen on port 5000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
