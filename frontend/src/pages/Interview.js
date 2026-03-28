import React, { useState } from "react";
import API from "./api.js";

function Interview({ token, setPage }) {
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);

  const startInterview = async () => {
    try {
      const res = await API.post(
        "/interview/start",
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${token}`},
          "Content-Type": "application/json"
        }
      );

      setQuestion(res.data.question);
      setInterviewId(res.data.interview_id);

      setAnswer("");
      setScore(null);
      setFeedback("");
      setWeakTopics([]);
      setQuestionNumber(1);

    } catch (err) {
      console.error("Start Interview Error:", err);
    }
  };

  const submitAnswer = async () => {
    try {
      if (questionNumber > 5) return;

      const res = await API.post(
        "/interview/answer",
        {
          interview_id: interviewId,
          question_number: questionNumber,
          answer: answer
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setQuestion(res.data.next_question || "Interview Completed");
      setAnswer("");
      setScore(res.data.score);
      setFeedback(res.data.feedback);
      setWeakTopics(res.data.weak_topics || []);

      if (questionNumber >= 5) {
        setQuestion("🎉 Interview Completed!");

        setTimeout(() => {
          setPage("result");
        }, 1500);

        return;
      }

      setInterviewId(res.data.interview_id);
      setQuestionNumber(prev => prev + 1);

    } catch (err) {
      console.error("Submit Answer Error:", err);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Interview
      </h1>

      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          maxWidth: "900px",
          width: "90%",
          margin: "40px auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}
      >
        {/* 🔥 START BUTTON */}
        <button
          onClick={() => setShowRoleSelect(true)}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Start Interview
        </button>

        <h3 style={{ marginBottom: "20px", color: "#cbd5f5" }}>
          {question || "Click start to begin your interview"}
        </h3>

        <textarea
          rows="4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box", 
            padding: "16px",
            minHeight: "120px",
            borderRadius: "12px",
            border: "1px solid #334155",
            marginBottom: "20px",
            background: "#0f172a",
            color: "white",
            resize:"none",
            overflowY: "hidden"
          }}
        />

        <button
          onClick={submitAnswer}
          disabled={questionNumber > 5}
          style={{
            background: "#22c55e",
            color: "white",
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Submit Answer
        </button>
      </div>

      {/* SCORE */}
      {score !== null && <h3>📊 Score: {score}</h3>}

      {/* FEEDBACK */}
      {feedback && (
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <strong>💡 Feedback:</strong>
          <p>{feedback}</p>
        </div>
      )}

      {/* WEAK TOPICS */}
      {weakTopics.length > 0 && (
        <div style={{ background: "#1e293b", padding: "15px", borderRadius: "12px" }}>
          <h4>⚠️ Weak Topics</h4>
          {weakTopics.map((topic, index) => (
            <p key={index}>- {topic}</p>
          ))}
        </div>
      )}

      {/* ✅ ✅ STEP 4: MODAL ADDED HERE */}
      {showRoleSelect && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "#020617",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            width: "300px"
          }}>
            <h3>Select Interview Type</h3>

            <button onClick={() => setSelectedRole("frontend")} style={roleBtn(selectedRole === "frontend")}>
              Frontend
            </button>

            <button onClick={() => setSelectedRole("backend")} style={roleBtn(selectedRole === "backend")}>
              Backend
            </button>

            <button onClick={() => setSelectedRole("database")} style={roleBtn(selectedRole === "database")}>
              Database
            </button>

            <br /><br />

            <button
              onClick={() => {
                if (!selectedRole) {
                  alert("Please select a role");
                  return;
                }
                setShowRoleSelect(false);
                startInterview();
              }}
              style={{
                background: "#22c55e",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ✅ STEP 5: STYLE FUNCTION */
const roleBtn = (active) => ({
  display: "block",
  width: "100%",
  margin: "8px 0",
  padding: "10px",
  background: active ? "#3b82f6" : "#1e293b",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
});

export default Interview;
