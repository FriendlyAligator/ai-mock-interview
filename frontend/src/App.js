import React, { useState, useEffect} from "react";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Interview from "./pages/Interview.js";
import Result from "./pages/Result..js";
import Dashboard from "./pages/Dashboard.js";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [page, setPage] = useState("login");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [refresh, setRefresh] = useState(0); // 🔥 NEW
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [loginTime, setLoginTime] = useState("");
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("username");
    const time = localStorage.getItem("loginTime");

    if (user) setUsername(user);
    if (time) setLoginTime(time);

    if (!time) return;

    const interval = setInterval(() => {
      const diff = Math.floor((new Date() - new Date(time)) / 1000);

      const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");

      setElapsed(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
  if (page === "register") {
    return <Register setPage={setPage} />;
  }
  return <Login setToken={setToken} setPage={setPage} />;
}

  const navStyle = {
    padding: "6px 14px",
    marginRight: "8px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 0 0px transparent"
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      backgroundColor: "#0f172a",
      color: "white"
    }}>

      {/* 🔥 NAVBAR */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",  
        justifyContent: "space-between",
        alignItems: "center",
        background: "#020617",
        padding: "10px 20px",
        borderBottom: "1px solid #1e293b",
        paddingLeft: "32px" 
      }}>

        {/* LEFT → USER INFO */}
        <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "120px"}}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#facc15", fontWeight: "600" }}>
              {username || "USER"}
            </span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Logged in: {elapsed}
            </span>
          </div>
        </div>

        {/* CENTER → DESKTOP BUTTONS */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button style=
            {{ ...navStyle, background: page === "home" ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#1e293b", color: "white" }} 
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 0 12px #3b82f6, 0 0 25px #3b82f6";
              e.target.style.transform = "translateY(-2px) scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "0 0 0px transparent";
              e.target.style.transform = "translateY(0)";
            }} onClick={() => setPage("home")}>Home</button>
            <button style=
            {{ ...navStyle, background: page === "interview" ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#1e293b", color: "white" }} 
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 0 12px #3b82f6, 0 0 25px #3b82f6";
              e.target.style.transform = "translateY(-2px) scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "0 0 0px transparent";
              e.target.style.transform = "translateY(0)";
            }} onClick={() => setPage("interview")}>Interview</button>
            <button style={{ ...navStyle, background: page === "result" ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#1e293b", color: "white" }} 
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 0 12px #3b82f6, 0 0 25px #3b82f6";
              e.target.style.transform = "translateY(-2px) scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "0 0 0px transparent";
              e.target.style.transform = "translateY(0)";
            }} onClick={() => { setPage(""); setTimeout(() => setPage("result"), 0); }}>Result</button>
            <button style={{ ...navStyle, background: page === "dashboard" ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#1e293b", color: "white" }} 
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 0 12px #3b82f6, 0 0 25px #3b82f6";
              e.target.style.transform = "translateY(-2px) scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "0 0 0px transparent";
              e.target.style.transform = "translateY(0)";
            }} onClick={() => setPage("dashboard")}>Dashboard</button>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px",  flexShrink: 0  }}>

          {/* DESKTOP RESET + LOGOUT */}
          {!isMobile && (
            <>
              <button style={resetBtn(token)}
                onClick={async () => {
                const confirmReset = window.confirm("Are you sure?");
                if (!confirmReset) return;

                try {
                  const res = await fetch("http://127.0.0.1:8000/interview/reset", {
                    method: "DELETE", 
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });

                  if (!res.ok) throw new Error("Reset failed");

                  setMessage("History cleared successfully!");

                  // 🔥 Refresh dashboard
                  setRefresh(prev => prev + 1);
                  setPage("dashboard");

                } catch (err) {
                  console.error(err);
                  setMessage("Reset failed ❌");
                }
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = "0 0 10px #ef4444, 0 0 20px #ef4444";
                e.target.style.background = "#7f1d1d";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.background = "#1e293b";
                e.target.style.color = "#f87171";
              }}>🔄 Reset</button>
              
            {message && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2000
                }}>
                  <div style={{
                    background: "#020617",
                    padding: "25px 40px",
                    borderRadius: "10px",
                    textAlign: "center",
                    boxShadow: "0 0 20px rgba(0,0,0,0.6)",
                    border: "1px solid #334155"
                  }}>
                    <h3 style={{ color: "#22c55e", marginBottom: "10px" }}>
                      {message}
                    </h3>

                    <button
                      onClick={() => setMessage("")}
                      style={{
                        marginTop: "10px",
                        padding: "6px 14px",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}

              <button style={logoutBtn}
              onMouseOver={(e) => {
                  e.target.style.boxShadow = "0 0 10px #ef4444, 0 0 20px #ef4444";
                  e.target.style.background = "#7f1d1d";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "#1e293b";
                  e.target.style.color = "#f87171";
                }}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("loginTime");
                  setToken(null);
                }}
              >
                🚪 Logout
              </button>
            </>
          )}

          {/* 🔥 MOBILE HAMBURGER (RIGHT SIDE) */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                fontSize: "22px",
                background: "transparent",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* 🔥 OVERLAY */}
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 999
          }}
        />
      )}

      {/* 🔥 SIDEBAR (ONLY MOBILE) */}
      {isMobile && (
        <div style={{
          position: "fixed",
          top: 0,
          left: menuOpen ? "0" : "-260px",
          width: "240px",
          height: "100%",
          background: "#020617",
          padding: "20px",
          transition: "0.3s",
          zIndex: 1000
        }}>
          <h3 style={{ color: "#facc15" }}>Menu</h3>

          <button style={sideBtn} onClick={() => { setPage("home"); setMenuOpen(false); }}>🏠 Home</button>
          <button style={sideBtn} onClick={() => { setPage("interview"); setMenuOpen(false); }}>🎤 Interview</button>
          <button style={sideBtn} onClick={() => { setPage("result"); setMenuOpen(false); } }>📊 Result</button>
          <button style={sideBtn} onClick={() => { setPage("dashboard"); setMenuOpen(false); }}>📁 Dashboard</button>

          <hr />

         <button
  style={sideBtn}
  onClick={async () => {
    const confirmReset = window.confirm("Are you sure?");
    if (!confirmReset) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/interview/reset", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Reset failed");

      setMessage("History cleared successfully!");
      setRefresh(prev => prev + 1);
      setPage("dashboard");
      setMenuOpen(false); // ✅ close menu after click

    } catch (err) {
      console.error(err);
      setMessage("Reset failed ❌");
    }
  }}
>
  🔄 Reset
</button>

<button
  style={sideBtn}
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("loginTime");
    setToken(null);
    setMenuOpen(false); // ✅ close menu
  }}
>
  🚪 Logout
</button>
        </div>
      )}

      {/* PAGES */}
      <div style={{ paddingLeft: "32px" }}>
      {page === "interview" && <Interview token={token} setPage={setPage}/>}
      {page === "result" && <Result token={token} />}
      {page === "dashboard" && <Dashboard token={token} refresh={refresh}/>}
      </div>
    </div>
  );
}

const sideBtn = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  background: "#1e293b",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "left"
};

const logoutBtn = {
  padding: "6px 14px",
  background: "#1e293b",
  color: "#f87171",
  border: "1px solid #334155",
  borderRadius: "6px",
  cursor: "pointer"
};

const resetBtn = (token) => ({
  padding: "6px 14px",
  background: "#1e293b",
  color: "#f87171",
  border: "1px solid #334155",
  borderRadius: "6px",
  cursor: "pointer"
});

export default App;
