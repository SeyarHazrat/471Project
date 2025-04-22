import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    if (!user) {
      alert("User not logged in");
      navigate("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/applications/user/${user.id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/user-dashboard")} style={styles.backButton}>
        ← Back to Dashboard
      </button>
      <h2 style={styles.title}>Your Job Applications</h2>
      {applications.length === 0 ? (
        <p style={styles.noData}>You haven't applied to any jobs yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Skills</th>
              <th style={styles.th}>Degree</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>{app.job_title}</td>
                <td style={styles.td}>{app.company_name}</td>
                <td style={styles.td}>{app.status}</td>
                <td style={styles.td}>{app.skills}</td>
                <td style={styles.td}>{app.degree}</td>
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
    maxWidth: "850px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  noData: {
    fontSize: "1.1rem",
    color: "#666",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
  },
};

export default UserApplications;
