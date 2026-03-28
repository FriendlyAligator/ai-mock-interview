import React, { useEffect, useState } from "react";
import API from "./api.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ResponsiveContainer } from "recharts";

function Dashboard({ token , refresh }) {
  const [setInterviews] = useState([]);
  const [data, setData] = useState([]);
  const resetDashboard = async () => {
  try {
    const res = await API.delete("/interview/reset", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setData([]);
    setInterviews([]); // clear UI

    const result = await res.json();
    setData(result);
    alert("✅ Dashboard reset successful!");

    // reload dashboard data
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("❌ Error resetting dashboard");
  }
};

  const validScores = data.filter(d => d.score > 0);
 
const avgScore =
  data.length > 0
    ? (data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1)
    : 0;

const bestScore =
  data.length > 0
    ? Math.max(...data.map((d) => d.score))
    : 0;

const total = data.length;
const hasRealData = validScores.length > 0;

const cardStyle = {
  background: "#1e293b",
  color: "white",
  padding: "20px",
  borderRadius: "14px",
  width: "160px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)", // 🔥 stronger shadow
  transition: "all 0.3s ease",
  cursor: "pointer"
};

  useEffect(() => {
    API.get("/interview/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [token, refresh]);

return (
<div style={{
      padding: "30px",
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "white"
}}>
<h1 style={{
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "30px"
}}>
  📊 Dashboard
</h1>

  <div style={{
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginBottom: "30px"
}}>
  <div style={cardStyle}  
  onMouseOver={(e) => {
  e.currentTarget.style.transform = "translateY(-6px)";
  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)";
}}

onMouseOut={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
}}>
    <h3>📊 Avg Score</h3>
    <p>{avgScore}</p>
  </div>

  <div style={cardStyle}  
 onMouseOver={(e) => {
  e.currentTarget.style.transform = "translateY(-6px)";
  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)";
}}

onMouseOut={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
}}>
    <h3>🏆 Best Score</h3>
    <p>{bestScore}</p>
  </div>

  <div style={cardStyle}  
  onMouseOver={(e) => {
  e.currentTarget.style.transform = "translateY(-6px)";
  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)";
}}

onMouseOut={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
}}>
    <h3>🧠 Interviews</h3>
     <p>{data.length}</p>
  </div>
</div>
      {/* Chart Card */}
      <div style={{
        background: "#1e293b",
        padding: "30px",
        borderRadius: "12px",
        marginBottom: "30px"
      }}>
        <h3 style={{ marginBottom: "10px" }}>Performance Trend</h3>
        {!hasRealData && (
  <div style={{
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "20px",
    color: "#94a3b8"
  }}>
    
    <div style={{ fontSize: "28px", marginBottom: "8px" }}>
      📉
    </div>

    <p style={{ fontSize: "16px", margin: "5px 0" }}>
      No performance data yet
    </p>

    <p style={{ fontSize: "13px", color: "#64748b" }}>
      Start giving interviews to see your progress here 🚀
    </p>

  </div>
)}

        <div style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line
           type="monotone"
           dataKey="score"
           stroke="#38bdf8"
           strokeWidth={3}
           dot={{ r: 4 }}
          />
        </LineChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Score History Card */}
      <div style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px"
      }}>
        <h3>Score History</h3>

        {data.map((item, index) => (
          <p key={index}>
            {item.name}: <b>{item.score}</b>
          </p>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
