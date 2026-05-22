import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD
import { askGroq } from "../../api/groq";
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

export default function GroqChat() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, resumeText]);

  const handleAsk = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setLoading(true);
    appendMessage(trimmedPrompt, "user");
    setPrompt("");

    // Append resumeText as context
    const queryWithContext = resumeText
      ? `${trimmedPrompt}\n\nResume Info:\n${resumeText}`
      : trimmedPrompt;

    try {
      // Replace the following with your actual AI call
<<<<<<< HEAD
      const result = await askGroq(queryWithContext);
      // Demo: simulate AI response
      // const result = "This is a demo AI response based on your question and resume.";
=======
      // const result = await askGroq(queryWithContext);
      // Demo: simulate AI response
      const result = "This is a demo AI response based on your question and resume.";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

      appendMessage(result, "ai");
    } catch {
      appendMessage("⚠️ Error: Failed to get response.", "ai");
    } finally {
      setLoading(false);
    }
  };

  const appendMessage = (text, sender) => {
    setChatHistory((prev) => [...prev, { sender, text }]);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const resp = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();

      if (data.resumeText) {
        setResumeText(data.resumeText);
        appendMessage("✅ Resume uploaded and parsed.", "ai");
      } else {
        appendMessage("⚠️ Could not parse resume.", "ai");
      }
    } catch {
      appendMessage("⚠️ Upload failed.", "ai");
    } finally {
      setUploading(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setResumeText("");
    setPrompt("");
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #ddd",
          fontSize: "1.5rem",
          fontWeight: "700",
          backgroundColor: "#007BFF",
          color: "white",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        AI Career Advisor Chatbot
      </div>

      {/* Chat Content */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
        }}
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 18px",
                borderRadius: "20px",
                backgroundColor: msg.sender === "user" ? "#007BFF" : "#e9ecef",
                color: msg.sender === "user" ? "#fff" : "#212529",
                fontSize: "1rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Resume text preview */}
      {resumeText && (
        <div
          style={{
            padding: "0.75rem 1rem",
            fontSize: "0.85rem",
            color: "#6c757d",
            borderTop: "1px solid #ddd",
            maxHeight: "5rem",
            overflowY: "auto",
            backgroundColor: "#f1f3f5",
          }}
        >
          <strong>Parsed Resume Preview: </strong>
          <br />
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{resumeText}</pre>
        </div>
      )}

      {/* Input & controls */}
      <div
        style={{
          display: "flex",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #ddd",
          alignItems: "center",
          gap: "0.75rem",
          backgroundColor: "#fff",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask about career or upload resume..."
          style={{
            flexGrow: 1,
            padding: "10px 14px",
            fontSize: "1rem",
            borderRadius: "24px",
            border: "1px solid #ced4da",
            outline: "none",
          }}
          disabled={loading || uploading}
        />
        <button
          onClick={handleAsk}
          disabled={loading || uploading}
          style={{
            padding: "10px 18px",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "24px",
            color: "white",
            fontWeight: "bold",
            cursor: loading || uploading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Send"}
        </button>
        <label
          htmlFor="resume-upload"
          style={{
            cursor: uploading ? "not-allowed" : "pointer",
            backgroundColor: "#6c757d",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: "24px",
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </label>
        <input
          id="resume-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => handleUpload(e)}
          style={{ display: "none" }}
          disabled={uploading || loading}
        />
        <button
          onClick={() => {
            setChatHistory([]);
            setPrompt("");
            setResumeText("");
          }}
          style={{
            padding: "10px 14px",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "24px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title="Clear Chat"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
