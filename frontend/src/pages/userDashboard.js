import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/jobs");
        const data = await response.json();
        if (Array.isArray(data)) {
          setJobs(data);
          setFilteredJobs(data);
        } else if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
        setFilteredJobs([]);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;
    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experience_level === experienceFilter);
    }
    if (locationFilter) {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [experienceFilter, locationFilter, jobs]);

  const handleLogout = () => navigate("/login");
  const handleViewSavedJobs = () => navigate("/saved-jobs");
  const handleJobClick = (id) => navigate(`/job/${id}`);

  const experienceLevels = [...new Set(jobs.map(job => job.experience_level))];
  

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div>
      <nav style={styles.navbar}>
        <h2 style={styles.navbarText}>Welcome back!</h2>
        <div>
          <button onClick={handleViewSavedJobs} style={styles.button}>View Saved Jobs</button>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      </nav>

      <section style={styles.mainContent}>
        <h1 style={styles.mainTitle}>A one-stop shop for your job searching needs</h1>

        <div style={styles.filterWrapper}>
          <h3 style={styles.filterTitle}>Filter Jobs</h3>
          <div style={styles.filterContainer}>
            <div>
              <label>Filter by Experience: </label>
              <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} style={styles.select}>
                <option value="">All Experience Levels</option>
                {experienceLevels.map((level, idx) => (
                  <option key={idx} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
          </div>
        </div>

        <div style={styles.jobsSection}>
          <h2>View Jobs</h2>
          <div style={styles.jobList}>
            {currentJobs.length === 0 ? (
              <p>No jobs match your filters.</p>
            ) : (
              currentJobs.map((job) => (
                <div
                  key={job.id}
                  style={styles.jobCard}
                  onClick={() => handleJobClick(job.id)}
                >
                  <img
                    src={job.image ? `/jobimages/${job.image}` : "/jobimages/image1.jpg"}
                    alt={job.title}
                    style={styles.jobImage}
                    onError={(e) => (e.target.src = "/jobimages/image1.jpg")}
                  />
                  <h3>{job.title}</h3>
                  <p>{job.experience_level}</p>
                  <p>{job.company_name}</p>
                </div>
              ))
            )}
          </div>
        </div>

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
      </section>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#89CFF0",
  },
  navbarText: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: "1.5rem",
  },
  button: {
    backgroundColor: "#fff",
    color: "#007bff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
    fontSize: "1rem",
  },
  mainContent: {
    padding: "40px 20px",
    textAlign: "center",
  },
  mainTitle: {
    fontSize: "2rem",
    fontWeight: "lighter",
    background: "linear-gradient(90deg, rgba(0,123,255,1) 0%, rgba(0,255,255,1) 100%)",
    color: "transparent",
    WebkitBackgroundClip: "text",
  },
  jobsSection: {
    marginTop: "20px",
  },
  filterWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingRight: "40px",
    marginBottom: "20px",
  },
  filterTitle: {
    fontSize: "1.2rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  filterContainer: {
    display: "flex",
    gap: "20px",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  jobList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
  },
  jobCard: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  jobImage: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "10px",
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

export default UserDashboard;
