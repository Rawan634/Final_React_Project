import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/auth";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { MdOutlineLogin, MdOutlineAppRegistration } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
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
        setShowLoginSuccess(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000); 
      } else {
        await signup(formData);
        setSuccess("Signup successful! Please login.");
        setTimeout(() => {
          setSuccess("");
        }, 2000); 
        setIsLogin(true);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>
            {isLogin ? (
              <>
                <MdOutlineLogin className="auth-icon" /> Login
              </>
            ) : (
              <>
                <MdOutlineAppRegistration className="auth-icon" /> Sign Up
              </>
            )}
          </h2>
          <p className="auth-subtitle">
            {isLogin ? "Welcome back! Please login to continue." : "Create a new account to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>
          )}
          
          <div className="auth-input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <div className="auth-input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {(error || success) && (
            <div className="auth-message">
              {error && (
                <p className="auth-error">
                  <AiOutlineCloseCircle className="message-icon" />
                  {error}
                </p>
              )}
              {success && (
                <p className="auth-success">
                  <AiOutlineCheckCircle className="message-icon" />
                  {success}
                </p>
              )}
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {isLogin ? (
              <>
                <FaSignInAlt className="btn-icon" /> Login
              </>
            ) : (
              <>
                <FaUserPlus className="btn-icon" /> Sign Up
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p onClick={toggleForm} className="auth-switch">
            {isLogin ? (
              <>
                Don't have an account? <span>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account? <span>Login</span>
              </>
            )}
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;