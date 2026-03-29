import React, { useState } from "react";
import API from "../api.js";

function Login({ setToken, setPage}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      
      const formData = new URLSearchParams();
      formData.append("username", email);   // ⚠️ IMPORTANT
      formData.append("password", password);
      
      const res = await API.post("/users/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      
      const token = res.data.access_token;

      // ✅ Save token
      setToken(token);
      localStorage.setItem("token", token);

      // 🔥 UPDATED USERNAME LOGIC (ONLY CHANGE)
      const rawName = email.split("@")[0];
      const cleanName = rawName.replace(/[^a-zA-Z]/g, "");
      const firstName = cleanName.split(" ")[0];

      console.log("RAW:", rawName);
      console.log("CLEAN:", cleanName);
      console.log("FINAL:", firstName);

      localStorage.setItem("username", firstName.toUpperCase());

      // ✅ Save login time
      const now = new Date().toISOString();
      localStorage.setItem("loginTime", now);

    } catch (err) {
      alert("❌ Login failed");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #020617, #0f172a)"
    }}>
      
      <div 
      onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 10px #3b82f6, 0 0 30px #3b82f6, 0 0 60px #3b82f6";
      e.currentTarget.style.border = "1px solid #3b82f6";
      }}
      onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 40px rgba(59,130,246,0.25)";
      e.currentTarget.style.border = "1px solid #1e293b";
      }}
      style={{
        background: "#111827",
        padding: "40px",
        borderRadius: "14px",
        width: "360px",
        boxShadow: "0 0 40px rgba(59,130,246,0.25)",
        textAlign: "center",
        border: "1px solid #1e293b",
        
      }} >
  <h2
  style={{
    textAlign: "center",
    color: "#e2e8f0",
    transition: "color 0.3s ease, text-shadow 0.3s ease, transform 0.2s ease",
    cursor: "pointer",
    display: "inline-block" // ✅ prevents jump
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
  🔐 Login
</h2>

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
            placeholder="Enter your password"
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

        <button onClick={login} style={buttonStyle}
         onMouseOver={(e) => {
          e.target.style.boxShadow = "0 0 15px #3b82f6, 0 0 35px #3b82f6";
          e.target.style.transform = "translateY(-2px) scale(1.03)";
        }}
        onMouseOut={(e) => {
          e.target.style.boxShadow = "none";
          e.target.style.transform = "translateY(0)";
        }}
        >
          Sign In
        </button>
        
        <p style={{
        marginTop: "15px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "14px"
      }}>
        Don't have an account?{" "}
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
          onClick={() => setPage("register")}
        >
          Register
        </span>
    </p>
        <p style={{
          color: "#64748b",
          fontSize: "12px",
          marginTop: "15px"
        }}>
          Secure access to dashboard
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  paddingLeft: "8px",
  textIndent: "0px",   // 🔥 important
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  outline: "none",
  transition: "all 0.25s ease",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

export default Login;
