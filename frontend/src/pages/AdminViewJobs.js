// Handle imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminViewJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch jobs when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
      fetchJobs(storedUser.id);
    } else {
      console.error("No user logged in");
    }
  }, []);

  // Fetch jobs posted by current admin
  const fetchJobs = async (id) => {
    try {
      const res = await fetch(`https://job-portal-backend.onrender.com/api/jobs/user/${id}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleRowClick = (jobId) => {
    navigate(`/job/${jobId}?from=admin`);
  };

  // Handle deleting a job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`https://job-portal-backend.onrender.com/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Remove job from local state
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
      } else {
        alert("Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
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
              <th style={styles.th}></th>
              <th style={styles.th}></th> {/* Delete column */}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} style={styles.row}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.company_name}</td>
                <td style={styles.td}>{job.location}</td>
                <td style={styles.td}>{job.experience_level}</td>
                <td style={styles.td}>
                  <button style={styles.viewButton} onClick={() => handleRowClick(job.id)}>
                    View Job
                  </button>
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteButton} onClick={() => handleDelete(job.id)}>
                    Delete
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
    cursor: "default",
  },
  viewButton: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminViewJobs;
