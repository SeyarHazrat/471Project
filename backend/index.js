// Import required libraries
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require("multer");
const path = require("path");

// Create an express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/jobimages", express.static("jobimages"));

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Seyar456!',
  database: 'job_portal'
});

// Test DB connection
db.connect((err) => {
  if (err) console.error('Error connecting to MySQL:', err);
  else console.log('Connected to MySQL database!');
});

console.log("Server is starting...");

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Job Portal API!');
});

// ----------------- JOB ROUTES -----------------
app.delete('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  const query = 'DELETE FROM jobs WHERE id = ?';
  db.query(query, [jobId], (err) => {
    if (err) {
      console.error("Error deleting job:", err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  });
});

// Get applications submitted by a specific user
app.get("/api/applications/user/:userId", (req, res) => {
  const query = `
    SELECT applications.id, applications.status, applications.skills, applications.degree,
           jobs.title AS job_title, companies.name AS company_name
    FROM applications
    JOIN jobs ON applications.job_id = jobs.id
    JOIN companies ON jobs.company_id = companies.id
    WHERE applications.user_id = ?
  `;
  db.query(query, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
});


// Get all jobs
app.get('/api/jobs', (req, res) => {
  const query = `
    SELECT jobs.id, jobs.title, jobs.experience_level, jobs.image,companies.name as company_name
    FROM jobs JOIN companies ON jobs.company_id = companies.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

// Get specific job details
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
    if (err) return res.status(500).send('Server error');
    if (result.length === 0) return res.status(404).send('Job not found');
    res.json(result[0]);
  });
});

// Create a job with image upload
const jobImageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "jobimages/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const uploadJobImage = multer({ storage: jobImageStorage });

app.post("/api/jobs", uploadJobImage.single("image"), (req, res) => {
  const { title, experience_level, description, location, user_id, company_id, salary } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!image) return res.status(400).json({ error: "Image upload failed" });

  const query = `
    INSERT INTO jobs (title, experience_level, description, location, user_id, company_id, image, salary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [title, experience_level, description, location, user_id, company_id, image, salary], (err, result) => {
    if (err) {
      console.error("Error inserting job:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.status(201).json({ message: "Job created successfully", jobId: result.insertId });
  });
});

// Get jobs posted by a specific user
app.get('/api/jobs/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT jobs.*, companies.name AS company_name 
    FROM jobs 
    JOIN companies ON jobs.company_id = companies.id 
    WHERE jobs.user_id = ?
  `;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(result);
  });
});

// ----------------- COMPANY ROUTES -----------------

// Get a company by ID
app.get("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  const query = "SELECT * FROM companies WHERE id = ?";
  db.query(query, [companyId], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (result.length === 0) return res.status(404).json({ error: "Company not found" });
    res.json(result[0]);
  });
});

// ----------------- USER ROUTES -----------------

// Register user
app.post('/api/register', (req, res) => {
  const { user_name, email, password, role } = req.body;
  const query = 'INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [user_name, email, password, role], (err) => {
    if (err) return res.status(500).send({ error: 'Registration failed' });
    res.status(201).send({ message: 'User registered successfully' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?';
  db.query(query, [email, password, role], (err, results) => {
    if (err) return res.status(500).send({ error: 'Login failed' });
    if (results.length > 0) res.send(results[0]);
    else res.status(401).send({ error: 'Invalid credentials' });
  });
});

// Save username
app.post('/api/user', (req, res) => {
  const { user_name } = req.body;
  const query = 'INSERT INTO users (user_name) VALUES (?)';
  db.query(query, [user_name], (err, result) => {
    if (err) return res.status(500).send('Server error');
    db.query('SELECT user_name FROM users WHERE id = ?', [result.insertId], (err, userResult) => {
      if (err) return res.status(500).send('Server error');
      res.json(userResult[0]);
    });
  });
});

// ----------------- APPLICATION ROUTES -----------------

// Submit a job application
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: resumeStorage });

app.post('/api/apply', upload.single("resume"), (req, res) => {
  const { job_id, user_id, name, email, experience, skills, degree } = req.body;
  const resume = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO applications (job_id, user_id, status, resume, skills, degree)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [job_id, user_id, "Pending", resume, skills, degree], (err, result) => {
    if (err) return res.status(500).send("Server error");
    res.status(201).json({ message: "Application submitted!", applicationId: result.insertId });
  });
});

// Get applications to jobs posted by an admin
app.get("/api/applications/admin/:adminId", (req, res) => {
  const query = `
    SELECT 
      applications.id, applications.status, applications.resume,
      applications.skills, applications.degree,
      users.user_name AS name, users.email AS email,
      jobs.title AS job_title
    FROM applications
    JOIN jobs ON applications.job_id = jobs.id
    JOIN users ON applications.user_id = users.id
    WHERE jobs.user_id = ?
  `;
  db.query(query, [req.params.adminId], (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
});

// Delete an application
app.delete('/api/applications/:id', (req, res) => {
  db.query('DELETE FROM applications WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(200).json({ message: 'Application deleted successfully' });
  });
});
// Update application status
app.put('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE applications SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Server error while updating status' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({ message: 'Status updated successfully' });
  });
});

// ----------------- SAVED JOB ROUTES -----------------

// Save a job
app.post('/api/saved_jobs', (req, res) => {
  const { user_id, job_id } = req.body;
  const query = 'INSERT INTO saved_jobs (user_id, job_id, saved_at) VALUES (?, ?, NOW())';
  db.query(query, [user_id, job_id], (err) => {
    if (err) return res.status(500).send('Server error');
    res.status(201).send({ message: 'Job saved successfully' });
  });
});

// Get saved jobs
app.get('/api/saved_jobs/user/:user_id', (req, res) => {
  const query = `
    SELECT jobs.*, companies.name as company_name
    FROM saved_jobs
    JOIN jobs ON saved_jobs.job_id = jobs.id
    JOIN companies ON jobs.company_id = companies.id
    WHERE saved_jobs.user_id = ?
  `;
  db.query(query, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

// Remove a saved job
app.delete('/api/saved_jobs', (req, res) => {
  const { user_id, job_id } = req.body;
  db.query('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [user_id, job_id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.status(200).json({ message: 'Saved job removed successfully' });
  });
});

// ----------------- REVIEWS -----------------

// Get reviews for a company
app.get('/api/reviews/company/:company_id', (req, res) => {
  const query = 'SELECT * FROM reviews WHERE company_id = ?';
  db.query(query, [req.params.company_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

// Create company if it doesn't exist
app.post("/api/companies/check-or-create", (req, res) => {
  const { name } = req.body;
  const checkQuery = "SELECT * FROM companies WHERE name = ?";
  db.query(checkQuery, [name], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error checking company" });

    if (result.length > 0) {
      // Company already exists
      return res.status(200).json(result[0]);
    } else {
      // Create new company
      const insertQuery = "INSERT INTO companies (name) VALUES (?)";
      db.query(insertQuery, [name], (err, insertResult) => {
        if (err) return res.status(500).json({ error: "Error creating company" });
        return res.status(201).json({ id: insertResult.insertId, name });
      });
    }
  });
});

// Add a review
app.post('/api/reviews', (req, res) => {
  const { reviewer_id, company_id, rating, review_text } = req.body;
  const query = 'INSERT INTO reviews (reviewer_id, company_id, rating, review_text, created_at) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [reviewer_id, company_id, rating, review_text], (err, result) => {
    if (err) {
      console.error("Error inserting review:", err);
      return res.status(500).json({ error: "Failed to insert review" });
    }
    res.status(201).json({ message: "Review added successfully", reviewId: result.insertId });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
