import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      console.log(err);
      alert(
  "Login Failed!\n\nIf you don't have an account, please register first."
);
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">

      <h1>Nemotron 3 Super</h1>
<p className="tagline">
  AI Chatbot Assistant
</p>
      <h2>Login</h2>

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

      <button onClick={loginUser}>
        Login
      </button>
      <p className="register-text">
  Don't have an account?
</p>

<Link to="/register" className="register-link">
  Register here
</Link>

    </div>
  </div>
);
}

export default Login;