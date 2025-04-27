import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/auth";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { MdOutlineLogin, MdOutlineAppRegistration } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai"; // Icons for success and error

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess(""); // Reset success message when toggling
    setFormData({ username: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await login({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      } else {
        await signup(formData);
        setSuccess("Signup successful! Please login.");
        setIsLogin(true);
        setError(""); // Clear any previous errors on success
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
      setSuccess(""); // Clear success message if there's an error
      // Hide the error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animated-card parallax-card">
        <h2>
          {isLogin ? (
            <>
              <MdOutlineLogin size={28} style={{ marginBottom: "-5px" }} /> Login
            </>
          ) : (
            <>
              <MdOutlineAppRegistration size={28} style={{ marginBottom: "-5px" }} /> Sign Up
            </>
          )}
        </h2>
        <p className="subtitle">
          {isLogin ? "Welcome back! Please login." : "Create a new account."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <FaUser />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group password-group">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Conditionally render error or success message */}
          {(error || success) && (
            <div className="message-container">
              {error && (
                <p className="error-message">
                  <AiOutlineCloseCircle size={20} style={{ marginRight: "8px" }} />
                  {error}
                </p>
              )}
              {success && (
                <p className="success-message">
                  <AiOutlineCheckCircle size={20} style={{ marginRight: "8px" }} />
                  {success}
                </p>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? (
              <>
                <FaSignInAlt style={{ marginRight: "8px" }} /> Login
              </>
            ) : (
              <>
                <FaUserPlus style={{ marginRight: "8px" }} /> Sign Up
              </>
            )}
          </button>
        </form>

        <p onClick={toggleForm} className="switch-link">
          {isLogin ? (
            <>
              <FaUserPlus style={{ marginRight: "6px" }} />
              Don't have an account? <strong>Sign Up</strong>
            </>
          ) : (
            <>
              <FaSignInAlt style={{ marginRight: "6px" }} />
              Already have an account? <strong>Login</strong>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
