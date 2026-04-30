"use client";

import { useState } from "react";

export default function AccessibilityBar() {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  function getReadableText() {
    // Avoid reading nav repeatedly (optional improvement)
    const main = document.querySelector("main");
    return main ? main.innerText : document.body.innerText;
  }

  function startReading() {
    window.speechSynthesis.cancel();

    const text = getReadableText();
    const speech = new SpeechSynthesisUtterance(text);

   speech.lang = "en-US";
    speech.rate = 1.1;      // slightly faster = more child-like
    speech.pitch = 1.6;     // higher pitch = softer / "younger"

    speech.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(speech);
    setIsReading(true);
    setIsPaused(false);
  }

  function stopReading() {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  }

  function pauseResume() {
    if (!isReading) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }

  return (
    <div style={containerStyle}>
      {!isReading ? (
        <button onClick={startReading} style={buttonStyle}>
          🔊 Read
        </button>
      ) : (
        <>
          <button onClick={pauseResume} style={buttonStyle}>
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>

          <button onClick={stopReading} style={buttonStyle}>
            ⏹ Stop
          </button>
        </>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: "fixed",
  right: "18px",
  bottom: "18px",
  zIndex: 9999,
  display: "flex",
  gap: "10px",
  background: "white",
  padding: "10px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
};

const buttonStyle: React.CSSProperties = {
  background: "#F6D365",
  color: "#003B2F",
  border: "2px solid #006747",
  borderRadius: "12px",
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer",
};