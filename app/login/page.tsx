"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signIn() {
    setMsg("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg("Error: " + error.message);
    router.push("/add-device");
  }

  async function signUp() {
    setMsg("Signing up...");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg("Error: " + error.message);
    setMsg("Account created! Now sign in.");
  }

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#f4f9f6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          color: "#006747",
          textAlign: "center",
          marginBottom: "20px"
        }}>
          Rehab Device Login
        </h2>

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

        <button style={primaryButton} onClick={signIn}>
          Sign In
        </button>

        <button style={secondaryButton} onClick={signUp}>
          Create Account
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
  padding: "10px",
  backgroundColor: "#006747",
  color: "white",
  border: "none",
  borderRadius: "6px",
  marginBottom: "10px",
  cursor: "pointer"
};

const secondaryButton = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#008C5A",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};