import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminViewJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
      fetchJobs(storedUser.id);
    } else {
      console.error("No user logged in");
    }
  }, []);

  const fetchJobs = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/user/${id}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleRowClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ← Back to Dashboard
      </button>
      <h1 style={styles.title}>Jobs You've Posted</h1>
      {jobs.length === 0 ? (
        <p style={styles.noJobs}>No jobs posted yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Experience Level</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} onClick={() => handleRowClick(job.id)} style={styles.row}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.company_name}</td>
                <td style={styles.td}>{job.location}</td>
                <td style={styles.td}>{job.experience_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "auto",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "14px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  noJobs: {
    fontSize: "1.2rem",
    color: "#777",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
  },
  th: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ccc",
  },
  row: {
    cursor: "pointer",
  },
};

export default AdminViewJobs;
