//Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/saved_jobs/user/2");
      const data = await response.json();
      if (Array.isArray(data)) {
        const jobDetails = await Promise.all(
          data.map(async (job) => {
            try {
              const res = await fetch(`http://localhost:3000/api/jobs/${job.id}`);
              if (!res.ok) {
                console.warn(`Job ${job.id} fetch failed`);
                return null;
              }
              return await res.json();
            } catch (err) {
              console.error("Error fetching job details:", err);
              return null;
            }
          })
        );
        setSavedJobs(jobDetails.filter(job => job !== null)); // filter out any nulls
      } else {
        console.error("Saved jobs is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };
  

  const handleBack = () => {
    navigate("/user-dashboard");
  };

  const handleRemove = async (jobId) => {
    try {
      const response = await fetch("http://localhost:3000/api/saved_jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 2, job_id: jobId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Job removed from saved list");
        fetchSavedJobs();
      } else {
        alert(result.message || "Failed to remove job");
      }
    } catch (err) {
      console.error("Error removing saved job:", err);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ← Back to Dashboard
      </button>
      <h1 style={styles.title}>Your Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <p style={styles.noJobs}>No saved jobs yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Experience Level</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedJobs.map((job) => (
              <tr key={job.id} style={styles.tr}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.company_name}</td>
                <td style={styles.td}>{job.experience_level}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => navigate(`/job/${job.id}`)}
                    style={{ ...styles.button, marginRight: "8px" }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleRemove(job.id)}
                    style={{ ...styles.button, backgroundColor: "#dc3545" }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
// Styling
const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    position: "relative"
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
    color: "#007bff",
  },
  noJobs: {
    fontSize: "1.2rem",
    color: "#777",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
  },
  tr: {
    transition: "background 0.2s",
  },
  button: {
    padding: "8px 14px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SavedJobs;
