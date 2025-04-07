import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome Admin</h1>
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate("/admin/view-jobs")}>
          <h2>View Jobs</h2>
          <p>See jobs you've posted</p>
        </div>
        <div style={styles.card} onClick={() => navigate("/admin/view-applications")}>
          <h2>View Applications</h2>
          <p>See who applied for your jobs</p>
        </div>
        <div style={styles.card} onClick={() => navigate("/admin/create-job")}>
          <h2>Create Job</h2>
          <p>Post a new job listing</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
  card: {
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
};

export default AdminDashboard;
