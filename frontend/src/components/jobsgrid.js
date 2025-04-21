import React, { useState, useEffect } from "react";

const JobsGrid = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9; // Only show 9 jobs per page

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("https://four71project.onrender.com/api/jobs"); 
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      } else {
        console.error(data.message);
      }
    };

    fetchJobs();
  }, []);

  // Imaging grabbing information for testing purposes. 
  const getRandomImage = () => {
    const imageIndex = Math.floor(Math.random() * 9) + 1; 
    return `/jobimages/image${imageIndex}.jpg`; 
  };

  //Grid logic
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div>
      <div style={styles.gridContainer}>
        {currentJobs.map((job) => (
          <div key={job.id} style={styles.jobCard}>
            <img src={getRandomImage()} alt={job.title} style={styles.jobImage} />
            <h3>{job.title}</h3>
            <p>{job.experience_level}</p>
            <p>{job.company_name}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            style={currentPage === index + 1 ? styles.activePage : styles.pageButton}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
//Styling
const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 30%)",
    gap: "20px",
    padding: "20px",
    justifyContent: "center",
  },
  jobCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  jobImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  paginationContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  pageButton: {
    margin: "5px",
    padding: "8px 12px",
    border: "1px solid #ccc",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
  activePage: {
    margin: "5px",
    padding: "8px 12px",
    border: "1px solid #007bff",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
  },
};

export default JobsGrid;
