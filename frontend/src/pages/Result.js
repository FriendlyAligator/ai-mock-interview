import React, { useEffect, useState } from "react";

function Result({ token }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/interview/result`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("RESULT DATA:", data);

        setResult(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchResult();
  }, [token]);

  console.log("TOKEN:", token);
  if (!result) return <h2>Loading...</h2>;

  return (
    <div style={{
  maxWidth: "600px",
  margin: "40px auto",
  background: "#1e293b",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  color: "white"
}}>
  <h1 style={{ textAlign: "center" }}>🎯 Interview Result</h1>

  <p><b>Final Score:</b> {result.final_score}</p>
  <p><b>Average Score:</b> {result.average_score}</p>
  <p><b>Feedback:</b> {result.final_feedback || "No feedback available"}</p>
</div>
  );
}

export default Result;
