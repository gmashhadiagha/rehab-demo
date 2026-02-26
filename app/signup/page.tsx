"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signUp() {
    setMsg("Creating account...");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg("Error: " + error.message);

    setMsg("Account created! Please check your email (if required), then sign in.");
    // Optionally redirect to login:
    // router.push("/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f9f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "380px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h2
          style={{
            color: "#006747",
            textAlign: "center",
            marginBottom: "8px"
          }}
        >
          Create Account
        </h2>

        <p style={{ textAlign: "center", color: "#555", marginBottom: "24px" }}>
          CSU Rehabilitation Device Directory
        </p>

        <label>Email</label>
        <input
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={primaryButton} onClick={signUp}>
          Create Account
        </button>

        <button style={linkButton} onClick={() => router.push("/")}>
          ← Back to Home
        </button>

        <button style={linkButton} onClick={() => router.push("/login")}>
          Already have an account? Sign in
        </button>

        {msg && <p style={{ marginTop: "12px", fontSize: "14px" }}>{msg}</p>}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const primaryButton = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#006747",
  color: "white",
  border: "none",
  borderRadius: "6px",
  marginTop: "4px",
  cursor: "pointer",
  fontSize: "16px"
};

const linkButton = {
  width: "100%",
  padding: "10px",
  backgroundColor: "transparent",
  color: "#006747",
  border: "1px solid #006747",
  borderRadius: "6px",
  marginTop: "12px",
  cursor: "pointer",
  fontSize: "15px"
};