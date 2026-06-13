import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      alert("Registration Successful! Please login using your email and password.");

      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("You Might Be Already Registered Or Entered Wrong Inputs");
    }
  };

 return (
  <div className="register-container">
    <div className="register-card">

      <h1>Nemotron 3 Super</h1>
<p className="tagline">
  AI Chatbot Assistant
</p>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={registerUser}>
        Register
      </button>
      <p className="register-note">
  ⚠ Don't forget your Email and Password. You need them to login later.
</p>
<Link to="/Login" className="login-link">
  Login here
</Link>

    </div>
  </div>
);
}

export default Register;