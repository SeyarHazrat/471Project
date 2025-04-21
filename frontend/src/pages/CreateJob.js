import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [image, setImage] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if company exists or create new
      const companyRes = await fetch("https://four71project.onrender.com/api/companies/check-or-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName }),
      });

      const companyData = await companyRes.json();
      if (!companyRes.ok) throw new Error(companyData.message || "Failed to resolve company");

      const companyId = companyData.id;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("experience_level", experienceLevel);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("salary", salary);
      formData.append("user_id", 2); // 
      formData.append("company_id", companyId);
      if (image) formData.append("image", image);

      const response = await fetch("https://four71project.onrender.com/api/jobs", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Job created successfully!");
        navigate("/admin-dashboard");
      } else {
        alert(result.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An error occurred while creating the job.");
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/admin-dashboard")} style={styles.backButton}>
        ← Back to Home
      </button>
      <h1 style={styles.title}>Create New Job</h1>
      <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
        <p>
        Choose an Image for your job         :     
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.input} required />
        </p>
        <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={styles.input} required />
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
        <input type="text" placeholder="Experience Level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} style={styles.input} required />
        <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} style={styles.textarea} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} required />
        <input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} style={styles.input} required />
        <button type="submit" style={styles.button}>Create Job</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    position: "relative",
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
    textAlign: "center",
    color: "#007bff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "100px",
  },
  button: {
    padding: "12px",
    fontSize: "1.2rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CreateJob;
