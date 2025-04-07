import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [location] = useState(Math.random() > 0.5 ? "Calgary" : "Vancouver");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [averageRating, setAverageRating] = useState(5);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${id}`);
        if (!response.ok) throw new Error("Job not found");
        const data = await response.json();
        setJob(data);

        const companyResponse = await fetch(`http://localhost:3000/api/companies/${data.company_id}`);
        if (!companyResponse.ok) throw new Error("Company not found");
        const companyData = await companyResponse.json();
        setCompany(companyData);

        const reviewRes = await fetch(`http://localhost:3000/api/reviews/company/${data.company_id}`);
        if (!reviewRes.ok) throw new Error("Reviews not found");
        const reviewData = await reviewRes.json();
        const avg = reviewData.length > 0
          ? reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length
          : 5;
        setAverageRating(avg.toFixed(1));
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("job_id", job.id);
    formData.append("user_id", 2);

    try {
      const response = await fetch("http://localhost:3000/api/apply", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Application submitted successfully!");
        form.reset();
        navigate("/user-dashboard");
      } else {
        alert(result.message || "Failed to apply.");
      }
    } catch (err) {
      console.error("Application error:", err);
      alert("An error occurred while applying.");
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_id: 2, company_id: job.company_id, rating, review_text: null })
      });
      const result = await res.json();
      if (res.ok) {
        alert("Thanks for your review!");
        setAverageRating((prev) => ((parseFloat(prev) + rating) / 2).toFixed(1));
      } else {
        alert(result.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleSaveJob = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/saved_jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 2, job_id: job.id })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Job saved successfully!");
      } else {
        alert(data.message || "Failed to save job");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("An error occurred while saving the job.");
    }
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;
  if (!job || !company) return <p style={styles.error}>No job details available.</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/user-dashboard")} style={styles.backButton}>
        ← Back to Home
      </button>
      <img src={`/jobimages/image${(job.id % 9) + 1}.jpg`} alt={job.title} style={styles.jobImage} />
      <div style={styles.detailsContainer}>
        <h1 style={styles.title}>{job.title}</h1>
        <h2 style={styles.company}>{company.name}</h2>
        <p style={styles.location}><strong>Location:</strong> {location}</p>
        <p style={styles.experience}><strong>Experience Level:</strong> {job.experience_level}</p>
        <p style={styles.description}>{job.description}</p>
        <div>
          <h3>Average Rating: {averageRating} / 5</h3>
          <label>Review this Job:</label>
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} style={styles.input}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
            ))}
          </select>
          <button onClick={handleRatingSubmit} style={{ ...styles.button, marginTop: "10px" }}>Submit Review</button>
        </div>
        <button onClick={handleSaveJob} style={{ ...styles.button, marginTop: "15px", backgroundColor: "#28a745" }}>
          Save this Job
        </button>
      </div>
      <div style={styles.applyContainer}>
        <h2 style={styles.applyTitle}>Apply Now</h2>
        <form style={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="name" placeholder="Your Name" style={styles.input} required />
          <input type="text" name="lastname" placeholder="Last Name" style={styles.input} required />
          <input type="text" name="address" placeholder="Address" style={styles.input} required />
          <input type="text" name="education" placeholder="Education" style={styles.input} required />
          <input type="text" name="experience" placeholder="Years of Experience" style={styles.input} required />
          <input type="file" name="resume" accept="application/pdf" style={styles.input} required />
          <button type="submit" style={styles.button}>Submit Application</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "10px 15px",
    fontSize: "1rem",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
  },
  jobImage: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  detailsContainer: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  company: {
    fontSize: "1.5rem",
    color: "#007bff",
    marginBottom: "10px",
  },
  location: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  experience: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: "1.5",
    color: "#444",
  },
  applyContainer: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f1f8ff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  applyTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#555",
  },
  error: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "red",
  },
};

export default JobDetails;
