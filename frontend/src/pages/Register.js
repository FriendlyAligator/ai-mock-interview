import React, { useState } from "react";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("All fields are required ❌");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Registration failed ❌");
        return;
      }

      setMessage("Account created successfully ✅");

      setTimeout(() => {
        setPage("login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    }
  };

  return (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#020617"
    }}
  >
    <div
      className="login-card"
      onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 10px #3b82f6, 0 0 30px #3b82f6, 0 0 60px #3b82f6"
      e.currentTarget.style.border = "1px solid #3b82f6";
      }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 40px rgba(59,130,246,0.3)";
      e.currentTarget.style.border = "1px solid #1e293b";
      }}
      style={{
        width: "380px",
        padding: "30px",
        borderRadius: "16px",
        background: "#0f172a",
        boxShadow: "0 0 40px rgba(59,130,246,0.3)",
        border: "1px solid #1e293b"
      }}
    >
      <h2
      style={{
        textAlign: "center",
        color: "#e2e8f0",
        transition: "color 0.3s ease, text-shadow 0.3s ease, transform 0.2s ease",
        cursor: "pointer",
        display: "block",          
        width: "100%" 
      }}
      onMouseEnter={(e) => {
        e.target.style.color = "#1e40af";
        e.target.style.textShadow = "0 0 12px #1e40af";
        e.target.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.target.style.color = "#e2e8f0";
        e.target.style.textShadow = "none";
        e.target.style.transform = "scale(1)";
      }}
    >
         📝 Register
    </h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onFocus={(e) => {
          e.target.style.border = "1px solid #3b82f6";
          e.target.style.boxShadow = "0 0 10px #3b82f6";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid #334155";
          e.target.style.boxShadow = "none";
        }}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={(e) => {
          e.target.style.border = "1px solid #3b82f6";
          e.target.style.boxShadow = "0 0 10px #3b82f6";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid #334155";
          e.target.style.boxShadow = "none";
        }}
        style={inputStyle}
      />
      
      <input
        type="text"
        placeholder="Enter your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={(e) => {
          e.target.style.border = "1px solid #3b82f6";
          e.target.style.boxShadow = "0 0 10px #3b82f6";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid #334155";
          e.target.style.boxShadow = "none";
        }}
        style={inputStyle}
      />

      <button
      onClick={handleRegister}
      style={buttonStyle}
      onMouseOver={(e) => {
        e.target.style.boxShadow = "0 0 15px #3b82f6, 0 0 35px #3b82f6";
        e.target.style.transform = "translateY(-2px) scale(1.03)";
      }}
      onMouseOut={(e) => {
        e.target.style.boxShadow = "none";
        e.target.style.transform = "translateY(0)";
      }}
    >
      Create Account
    </button>

      {message && (
        <p
          style={{
            marginTop: "10px",
            textAlign: "center",
            color: message.includes("success") ? "#22c55e" : "#ef4444"
          }}
        >
          {message}
        </p>
      )}

      <p
        style={{
          marginTop: "18px",
          textAlign: "center",
          color: "#94a3b8"
        }}
      >
        Already have an account?{" "}
        <span
          style={{
            color: "#3b82f6",
            cursor: "pointer",
            fontWeight: "500"
          }}
          onMouseOver={(e) => {
            e.target.style.textDecoration = "underline";
            e.target.style.color = "#60a5fa";
          }}
          onMouseOut={(e) => {
            e.target.style.textDecoration = "none";
            e.target.style.color = "#3b82f6";
          }}
          onClick={() => setPage("login")}
        >
          Login
        </span>
      </p>

      <p
        style={{
          marginTop: "10px",
          textAlign: "center",
          color: "#64748b",
          fontSize: "12px"
        }}
      >
        Create your account to get started 
      </p>
    </div>
  </div>
);
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  outline: "none",
  transition: "all 0.25s ease",
  boxSizing: "border-box"   // ✅ ADD THIS (MOST IMPORTANT)
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.3s ease" 
};

export default Register;
