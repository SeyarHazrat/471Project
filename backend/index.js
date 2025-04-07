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


app.get('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  const query = `
    SELECT jobs.*, companies.name AS company_name, users.user_name 
    FROM jobs
    JOIN companies ON jobs.company_id = companies.id
    JOIN users ON jobs.user_id = users.id
    WHERE jobs.id = ?
  `;
  db.query(query, [jobId], (err, result) => {
    if (err) {
      console.error('Error fetching job:', err);
      res.status(500).send('Server error');
    } else if (result.length === 0) {
      res.status(404).send('Job not found');
    } else {
      res.json(result[0]);
    }
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
      // ✅ Send full user data (so frontend can store in localStorage)
      res.send(results[0]);
    } else {
      res.status(401).send({ error: 'Invalid credentials' });
    }
  });
});

// Get jobs posted by a specific user (admin)
app.get('/api/jobs/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT jobs.*, companies.name AS company_name 
    FROM jobs 
    JOIN companies ON jobs.company_id = companies.id 
    WHERE jobs.user_id = ?
  `;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user's jobs:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(result);
  });
});

app.get("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  const query = "SELECT * FROM companies WHERE id = ?";
  db.query(query, [companyId], (err, result) => {
    if (err) {
      console.error("Error fetching company:", err);
      res.status(500).json({ error: "Server error" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Company not found" });
    } else {
      res.json(result[0]);
    }
  });
});
  

const multer = require("multer");
const path = require("path");

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store resumes here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });

app.post('/api/apply', upload.single("resume"), (req, res) => {
  const { job_id, user_id, name, email, experience } = req.body;
  const resume = req.file.filename;

  const query = `
    INSERT INTO applications (job_id, user_id, status, resume)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [job_id, user_id, "Pending", resume], (err, result) => {
    if (err) {
      console.error("Error saving application:", err);
      res.status(500).send("Server error");
    } else {
      res.status(201).json({ message: "Application submitted!", applicationId: result.insertId });
    }
  });
});

app.use("/uploads", express.static("uploads"));

app.get('/api/reviews/company/:company_id', (req, res) => {
  const companyId = req.params.company_id;
  const query = 'SELECT * FROM reviews WHERE company_id = ?';

  db.query(query, [companyId], (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(200).json([]); // Return empty array if no reviews
    }

    res.json(results);
  });
});
app.post('/api/saved_jobs', (req, res) => {
  const { user_id, job_id } = req.body;

  const query = 'INSERT INTO saved_jobs (user_id, job_id, saved_at) VALUES (?, ?, NOW())';
  db.query(query, [user_id, job_id], (err, result) => {
    if (err) {
      console.error('Error saving job:', err);
      res.status(500).send('Server error');
    } else {
      res.status(201).send({ message: 'Job saved successfully' });
    }
  });
});
app.get('/api/saved_jobs/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `
    SELECT saved_jobs.*, jobs.title, jobs.experience_level, companies.name AS company_name
    FROM saved_jobs
    JOIN jobs ON saved_jobs.job_id = jobs.id
    JOIN companies ON jobs.company_id = companies.id
    WHERE saved_jobs.user_id = ?
  `;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error getting saved jobs:', err);
      res.status(500).send('Server error');
    } else {
      res.json(result);
    }
  });
});
// Get saved jobs for a user
app.get('/api/saved_jobs/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `
    SELECT jobs.*, companies.name as company_name
    FROM saved_jobs
    JOIN jobs ON saved_jobs.job_id = jobs.id
    JOIN companies ON jobs.company_id = companies.id
    WHERE saved_jobs.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching saved jobs:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/applications/admin/:adminId", (req, res) => {
  const adminId = req.params.adminId;
  const query = `
    SELECT 
      applications.id,
      applications.status,
      applications.resume,
      users.user_name AS name,
      users.email AS email,
      jobs.title AS job_title
    FROM applications
    JOIN jobs ON applications.job_id = jobs.id
    JOIN users ON applications.user_id = users.id
    WHERE jobs.user_id = ?
  `;

  db.query(query, [adminId], (err, results) => {
    if (err) {
      console.error("Error fetching applications for admin:", err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.json(results);
    }
  });
});


// Set up the server to listen on port 5000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
