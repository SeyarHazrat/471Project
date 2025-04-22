import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");  
  const [email, setEmail] = useState("");        
  const [password, setPassword] = useState("");  // State 
  const [role, setRole] = useState("user");      
  const navigate = useNavigate();  // Hook 

  // Function to handle form
  const handleRegister = async (e) => {
    e.preventDefault();  

    // Send information 
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: userName,  
        email,                
        password,             
        role                  
      }),
    });

    const data = await response.json();  
    if (response.ok) {
      alert("Account created successfully! Please log in.");
      navigate("/login");  
    } else {
      alert(data.message || "Failed to create account");  
    }
  };

  return (
    <div style={styles.container}>
      {/* Displaying logo at top-left */}
      <img src={"/C:/Users/seyar/OneDrive/Desktop/job-portal/frontend/public/schoolLogo.png"} style={styles.logo} />
      <h2>Welcome! Create an Account</h2>
      
      {/* Registration form */}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}  
          required
          style={styles.input}
        />
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
        {/* Dropdown for selecting user role */}
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
          <option value="user">Sign Up as User</option>
          <option value="admin">Sign Up as Admin</option>
        </select>
        
        {/* Submit button to create account */}
        <button type="submit" style={styles.button}>Create Account</button>
      </form>

      {/* Button to go back to login page */}
      <button onClick={() => navigate("/login")} style={styles.secondaryBtn}>
        Back to Login
      </button>
    </div>
  );
};


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  logo: {
    width: "80px",
    position: "absolute",
    top: "20px",
    left: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  secondaryBtn: {
    backgroundColor: "#6c757d",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default Register;
