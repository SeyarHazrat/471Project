Clear Hire - Job Portal

// 30180289
// Seyar Ghulom Hazrat
// 30171176
// Abdullah Khan
// 301714465
// Abdu Rahman Ben Issa

Frontend: React.js
Backend: Node.js + Express
Database: MySQL

Features: 
User: View, filter, and search job postings. Apply to jobs with resume upload. Save favorite jobs. Leave company reviews. View your own applications with status tracking. Custom filtering by experience and location

Admin: Post new jobs with images. View applications submitted to their job posts. Image upload support for job postings

Authentication: Basic role-based login (Admin & User) with localStorage session handling.

Getting Started: 

git clone https://github.com/SeyarHazrat/471Project.git

Setup backend: 

cd backend
npm install
npm start

Setup Frontend: 

cd frontend
npm install
npm run dev

Database:

Set up the MySQL database with the .sql file
Step-by-Step for MySQL Workbench:
Open MySQL Workbench
Make sure your MySQL server is running.

Create a new schema

Go to the Navigator > SCHEMAS section.

Right-click and select "Create Schema..."

Name it: job_portal (this must match the database name used in the backend code).

Click Apply to create it.

Import the SQL file

Go to File > Open SQL Script...

Select the .sql file from the project folder.

Make sure you're connected to your MySQL instance and the correct schema is selected.

Click Execute ( lightning bolt icon) to run the script.

Verify

After execution, you should see the job_portal schema with the required tables and some default data.

Change SQL connection password to the one you have in your MySQL Workbench. 


Contributors:

Seyar Hazrat

Abdullah Khan

Abdu Rahman Ben Issa
