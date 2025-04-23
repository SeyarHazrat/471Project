-- STEP 0: Drop all existing tables cleanly
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS saved_jobs;
DROP TABLE IF EXISTS degrees;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- STEP 1: Create `users`
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255),
  role ENUM('admin','user') DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users VALUES
(1,'seyar',NULL,NULL,'user'),
(2,'seyar','seyar@gmail.com','123','admin'),
(4,'Seyar','seyar1@gmail.com','123','user'),
(5,'abdullah','testing@gmail.com','123','user'),
(6,'abdu','abdu@gmail.com','123','user');

-- STEP 2: Create `companies`
CREATE TABLE companies (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO companies VALUES
(110,'Adobe'),(102,'Amazon'),(105,'Apple'),(113,'Apple Inc'),(123,'Atco Ltd.'),
(117,'Berkshire Hathaway'),(122,'Cenovus Energy Inc'),(101,'Facebook'),
(104,'Google'),(124,'IBM'),(109,'LinkedIn'),(106,'Microsoft'),
(114,'Microsoft Corp.'),(103,'Netflix'),(115,'Nvidia'),(108,'Snap Inc.'),
(121,'Suncor Energy Inc'),(116,'Tesla'),(111,'test'),(112,'tests'),
(107,'Twitter'),(118,'Visa'),(119,'Walmart'),(120,'Walt Disney Co');

-- STEP 3: Create `jobs`
CREATE TABLE jobs (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  company_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  experience_level ENUM('Entry','Mid','Senior','Intern') NOT NULL,
  description TEXT,
  image VARCHAR(255),
  salary DECIMAL(10,2),
  PRIMARY KEY (id),
  KEY (user_id),
  KEY (company_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- You can paste the large INSERT INTO jobs block here from the previous message
INSERT INTO jobs VALUES 
(42,2,113,'Software Engineer','Palo Alto, California','Senior','Key Qualifications\r\n5+ years of professional software development experience\r\n\r\nStrong expertise in one or more of the following: Swift, Objective-C, C++, Python, or Java\r\n\r\nDeep understanding of software engineering principles, data structures, algorithms, and design patterns\r\n\r\nExperience with system architecture and scalable application development\r\n\r\nProven ability to deliver complex software projects from concept to production\r\n\r\nFamiliarity with iOS/macOS development frameworks is a strong plus\r\n\r\nPassion for writing clean, maintainable, and efficient code\r\n\r\nExcellent problem-solving, debugging, and performance optimization skills\r\n\r\nStrong communication and collaboration skills; ability to lead technical discussions and mentor junior engineers','1745346496075.jpg',250000.00),
(43,2,114,'Data Analyst','Vancouver, British Columbia','Mid','Key Responsibilities\r\nData Analysis & Reporting: Analyze marketplace health metrics to derive insights and conduct investigations. Pull data from various sources and connect insights.\r\n\r\nTool Improvement: Improve current monitoring and investigation toolkits.\r\n\r\nCross-Functional Collaboration: Coordinate with engineering and business teams to mitigate live site issues.\r\n\r\nRoot Cause Analysis: Conduct root cause analyses and follow-ups to prevent future issues.\r\n\r\nOn-Call Support: Participate in an on-call rotation to respond to emerging issues.','1745346624207.jpg',165000.00),
(44,2,102,'Software Developer ','Calgary, Alberta','Intern','As an SDE Intern at Amazon, you\'ll collaborate with experienced engineers to design, develop, and deploy innovative software solutions. Your work will directly impact Amazon\'s vast array of products and services, contributing to projects in distributed systems, data mining, automation, optimization, scalability, and security.','1745346722210.jpg',45000.00),
(45,2,115,'Project Manager','New York City, New York','Senior','As a Senior Project Manager at NVIDIA, you will lead complex, cross-functional projects within a dynamic and innovative environment. Your responsibilities will encompass project planning, execution, and delivery, ensuring alignment with NVIDIA\'s strategic objectives.','1745346856681.jpg',260000.00),
(46,2,116,'Reliability Engineer','Palo Alto, California','Intern','Tesla is a global leader in electric vehicles, clean energy, and advanced battery technology. Founded by Elon Musk, the company aims to accelerate the world’s transition to sustainable energy. Tesla designs and manufactures electric cars, solar products, and energy storage systems, setting industry standards in innovation and performance. Its vehicle lineup includes the Model S, 3, X, and Y, as well as the upcoming Cybertruck and Semi. Beyond cars, Tesla’s energy division provides solar roofs and Powerwall systems to homes and businesses. The company is also deeply involved in autonomous driving technologies and AI-powered solutions.','1745346988777.jpg',65000.00),
(47,2,117,'Finance Intern','Toronto, Ontario','Intern','Berkshire Hathaway is a multinational conglomerate led by legendary investor Warren Buffett. It owns a diverse portfolio of businesses in insurance, railroads, energy, manufacturing, retail, and more. Some of its well-known subsidiaries include GEICO, BNSF Railway, and Dairy Queen. The company is also a major investor in publicly traded companies such as Apple, Coca-Cola, and Bank of America. Known for its long-term investment strategy and strong financial discipline, Berkshire Hathaway emphasizes value investing. It is one of the most respected and financially secure corporations in the world.','1745347070239.jpg',85000.00),
(48,2,118,'Senior Engineer','Houston, Texas','Senior','Visa is a global leader in digital payments and financial technology. It facilitates electronic funds transfers and processes billions of transactions each year across more than 200 countries. The company offers credit, debit, and prepaid products and services to consumers, businesses, and governments. Visa is known for its robust security infrastructure and continuous innovation in areas like contactless payments and mobile wallets. Through strategic partnerships with banks, fintechs, and retailers, Visa plays a critical role in global commerce. Its technology enables fast, secure, and reliable payments worldwide.','1745347138528.jpg',175000.00),
(49,2,119,'Data Analyst','Montreal ,Quebec','Entry','Walmart is the world’s largest retailer by revenue, operating a vast network of hypermarkets, discount stores, and e-commerce platforms. Founded in 1962, it serves millions of customers daily in the U.S. and internationally. Walmart’s business model focuses on delivering low prices and a wide range of products, from groceries to electronics. The company is also a leader in supply chain innovation and sustainability initiatives. Its digital transformation includes partnerships with tech firms and expansion into cloud infrastructure, logistics, and data science. Walmart continues to redefine retail through omnichannel strategies and customer-centric technologies.','1745347315701.jpg',80000.00),
(50,2,120,'Product Manager','Seattle, Washington','Mid','The Walt Disney Company is a global entertainment conglomerate with operations spanning media networks, theme parks, film studios, and streaming services. It owns beloved brands like Pixar, Marvel, Star Wars, and National Geographic. Disney\'s streaming platform, Disney+, has rapidly become a major player in digital entertainment. The company also operates world-renowned theme parks and resorts in the U.S., Europe, and Asia. With a legacy of storytelling and technological innovation, Disney remains at the forefront of family-friendly content creation. Its strategic acquisitions and creative ventures continue to drive its influence across the global media landscape.','1745347387137.jpg',150000.00),
(52,2,122,'Project Manager','Calgary, Alberta','Mid','Cenovus Energy is a Canadian oil and natural gas company headquartered in Calgary, Alberta. It is one of the largest producers of oil sands in Canada and operates in both the upstream and downstream sectors. Cenovus focuses on the development of its oil sands projects in Alberta and has a significant presence in the natural gas sector. The company is known for its commitment to sustainable development and has invested in technologies aimed at reducing greenhouse gas emissions. Cenovus is also involved in refining operations and has a strong track record of operational efficiency.','1745347556277.jpg',125000.00),
(52,2,122,'Project Manager','Calgary, Alberta','Mid','Cenovus Energy is a Canadian oil and natural gas company headquartered in Calgary, Alberta. It is one of the largest producers of oil sands in Canada and operates in both the upstream and downstream sectors. Cenovus focuses on the development of its oil sands projects in Alberta and has a significant presence in the natural gas sector. The company is known for its commitment to sustainable development and has invested in technologies aimed at reducing greenhouse gas emissions. Cenovus is also involved in refining operations and has a strong track record of operational efficiency.​','1745347556277.jpg',125000.00),
(53,2,123,'Data Analyst','Calgary, Alberta','Entry','ATCO Ltd. is a Canadian diversified company providing products and services in the areas of energy, utilities, construction, and logistics. Headquartered in Calgary, ATCO operates in more than 100 countries and is involved in natural gas and electricity distribution, as well as modular building construction. It is also active in energy generation and retail, serving industrial and commercial sectors. ATCO’s global presence and commitment to sustainability position it as a leader in innovation across energy, infrastructure, and logistics.','1745347650924.jpg',85000.00),
(54,2,124,'Team Lead','Calgary, Alberta','Mid','IBM has a strong presence in Calgary, providing a wide range of IT services, including cloud computing, artificial intelligence, and enterprise solutions. The company serves both public and private sector clients in Calgary, working across industries such as finance, energy, and healthcare. IBM is known for its innovation and cutting-edge technology, with a focus on helping businesses digitally transform and adopt smarter technologies. The Calgary office is part of IBM’s broader strategy to support businesses in Western Canada with advanced technology services and solutions.','1745347718732.jpg',150000.00);

-- STEP 4: Create `applications`
CREATE TABLE applications (
  id INT NOT NULL AUTO_INCREMENT,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('Pending','Reviewed','Rejected','Accepted') DEFAULT 'Pending',
  applied_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  resume VARCHAR(255),
  skills TEXT,
  degree VARCHAR(255),
  PRIMARY KEY (id),
  KEY (job_id),
  KEY (user_id),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO applications VALUES
(13,42,4,'Rejected','2025-04-22 19:31:36','1745350296879.pdf','C, C#, Java','Computer Science'),
(14,47,6,'Rejected','2025-04-22 19:39:22','1745350762451.pdf','C, C#, Java','Computer Science');

-- STEP 5: Create `reviews`
CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  reviewer_id INT NOT NULL,
  company_id INT NOT NULL,
  rating INT,
  review_text TEXT,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY (reviewer_id),
  KEY (company_id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO reviews VALUES
(1,2,112,5,NULL,'2025-04-22 16:40:50'),
(2,2,112,4,NULL,'2025-04-22 16:40:54'),
(3,2,112,1,NULL,'2025-04-22 16:40:58'),
(4,2,112,5,NULL,'2025-04-22 16:41:06'),
(5,2,112,5,NULL,'2025-04-22 16:41:09'),
(6,2,113,4,NULL,'2025-04-22 19:30:34'),
(7,2,117,5,NULL,'2025-04-22 19:32:59'),
(8,2,102,4,NULL,'2025-04-22 19:38:38'),
(9,2,114,1,NULL,'2025-04-22 19:45:37'),
(10,2,114,5,NULL,'2025-04-22 19:45:40'),
(11,2,114,5,NULL,'2025-04-22 19:45:44'),
(12,2,114,5,NULL,'2025-04-22 19:45:46'),
(13,2,114,5,NULL,'2025-04-22 19:45:48'),
(14,2,114,5,NULL,'2025-04-22 19:45:49'),
(15,2,114,5,NULL,'2025-04-22 19:45:51'),
(16,2,114,5,NULL,'2025-04-22 19:45:52');

-- STEP 6: Create `saved_jobs`
CREATE TABLE saved_jobs (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  saved_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY (user_id),
  KEY (job_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO saved_jobs VALUES
(17,2,42,'2025-04-22 19:59:10');

-- STEP 7: Create `degrees`
CREATE TABLE degrees (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  name VARCHAR(100),
  PRIMARY KEY (id),
  KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- STEP 8: Create `skills`
CREATE TABLE skills (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  name VARCHAR(100),
  PRIMARY KEY (id),
  KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
