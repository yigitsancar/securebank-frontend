import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import api from "./api/api";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const userResponse = await api.get("/api/users/me");
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchCurrentUser().then((currentUser) => {
        if (currentUser) {
          navigate("/dashboard");
        }
      });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);

      await fetchCurrentUser();
      setMessage("");
      navigate("/dashboard");
    } catch (error) {
      setMessage("Login failed!");
    }
  };

  const handleRegister = async () => {
    try {
      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      setMessage("Register successful! You can login now.");
      setIsRegisterMode(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Register failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUsername("");
    setPassword("");
    setEmail("");
    setMessage("");
    navigate("/");
  };

   const authPage = (
    <div className="container">
      <div className="card">
        <h1>SecureBank</h1>
        <p>Banking Platform</p>

        <div className="form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {isRegisterMode && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isRegisterMode && (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          )}

          <button
            className="register-btn"
            onClick={
              isRegisterMode ? handleRegister : () => setIsRegisterMode(true)
            }
          >
            {isRegisterMode ? "Create Account" : "Register"}
          </button>

          {isRegisterMode && (
            <button
              className="cancel-btn"
              onClick={() => {
                setIsRegisterMode(false);
                setEmail("");
                setMessage("");
              }}
            >
              Cancel
            </button>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : authPage} />

      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              user={user}
              setUser={setUser}
              handleLogout={handleLogout}
              fetchCurrentUser={fetchCurrentUser}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
