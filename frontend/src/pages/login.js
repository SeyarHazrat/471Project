import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is user
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`Logged in as ${role}`);
      if (role === "admin") {
        navigate("/admin-dashboard"); // Redirect to admin page
      } else {
        navigate("/user-dashboard"); // Redirect to user page
      }
    } else {
      alert("Invalid login credentials");
    }
  };

  return (
    <div style={styles.container}>
      {/* Logo */}
      <img src="/C:\Users\seyar\OneDrive\Desktop\job-portal\frontend\public\schoolLogo.png" style={styles.logo} />

      {/* Welcome Title */}
      <h1 style={styles.title}>Welcome to Our Job Portal</h1>
      <p style={styles.subtitle}>
        Login or create an account to get started!
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
          <option value="user">Login as User</option>
          <option value="admin">Login as Admin</option>
        </select>
        <button type="submit" style={styles.button}>Login</button>
      </form>

      {/* Create Account Button */}
      <button onClick={() => navigate("/register")} style={styles.createButton}>
        Create Account
      </button>
    </div>
  );
};

// Styles Object
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "20px",
  },
  logo: {
    position: "absolute",
    top: "20px",
    left: "20px",
    width: "80px", // Adjust size of logo
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  select: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  createButton: {
    width: "320px",
    padding: "12px",
    marginTop: "15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
};


export default Login;
