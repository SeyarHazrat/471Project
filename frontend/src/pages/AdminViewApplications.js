// Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminViewApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user information 
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
      fetchApplications(storedUser.id);
    } else {
      console.error("No user logged in");
    }
  }, []);

  const fetchApplications = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/applications/admin/${id}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/applications/${applicationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchApplications(userId);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/applications/${applicationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchApplications(userId);
      } else {
        alert("Failed to delete application");
      }
    } catch (err) {
      console.error("Error deleting application:", err);
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
      <h1 style={styles.title}>Applications to Your Jobs</h1>
      {applications.length === 0 ? (
        <p style={styles.noData}>No applications found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Applicant Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}></th>
              <th style={styles.th}>Resume</th>
              <th style={styles.th}>Skills</th>
              <th style={styles.th}>Degree</th>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>{app.name}</td>
                <td style={styles.td}>{app.email}</td>
                <td style={styles.td}>{app.experience}</td>
                <td style={styles.td}>
                  <a href={`http://localhost:3000/uploads/${app.resume}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </td>
                <td style={styles.td}>{app.skills || "N/A"}</td>
                <td style={styles.td}>{app.degree || "N/A"}</td>
                <td style={styles.td}>{app.job_title}</td>
                <td style={styles.td}>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(app.id)}
                  >
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

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1000px",
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
  noData: {
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
  select: {
    padding: "6px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminViewApplications;
