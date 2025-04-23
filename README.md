# Clear Hire – Job Portal

## Project Members
- **Seyar Ghulom Hazrat** – 30180289  
- **Abdullah Khan** – 30171176  
- **Abdu Rahman Ben Issa** – 30171465

---

## Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express  
- **Database**: MySQL

---

### User:
- View, search, and filter job postings
- Apply to jobs with resume upload
- Save favorite jobs
- Leave company reviews
- Track application statuses
- Filter jobs by experience level and location

### Admin:
- Post new jobs with image uploads
- View applications submitted to their postings

### Authentication:
- Role-based login system (Admin & User)
- Session handling using `localStorage`

---

## Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SeyarHazrat/471Project.git

Backend Setup:

cd backend
npm install
npm start


Frontend Setup:

cd frontend
npm install
npm run dev

Database:

Use MySQL Workbench to create the database and import the schema/data.

Step-by-Step:
Open MySQL Workbench

Ensure your MySQL server is running

Go to the Navigator > SCHEMAS panel

Right-click and select "Create Schema..."

Name it:
job_portal
Click Apply to create the schema

Set job_portal as the default schema (right-click > Set as Default)

Importing the SQL Schema
You have two .sql files available:

First, try to import: backup.sql
Go to File > Open SQL Script...

Select backup.sql from the project folder

Click the ⚡ Execute (lightning bolt) to run the script

If backup.sql fails, use job_portal.sql instead:
Go to File > Open SQL Script...

Select job_portal.sql from the project folder

Make sure job_portal is still your default schema

Click Execute.

Final Step: 
Verify that the following tables exist under job_portal:

users

companies

jobs

applications

reviews

saved_jobs

degrees

skills


Now, save and run. CHANGE SETUP (USERNAME & PASSWORD) IN INDEX.JS TO YOUR MYSQL DETAILS.

Run backend and frontend as mentioned above, and enjoy!

Contributors:

Seyar Ghulom Hazrat

Abdullah Khan

Abdu Rahman Ben Issa
