"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signUp() {
    if (!email || !password) return setMsg("Please enter both an email and password.");
    
    setMsg("Creating your account...");
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setMsg("Error: " + error.message);
    } else {
      setMsg("Account created! Check your email for a confirmation link.");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        {/* BRANDED HEADER */}
        <header style={styles.header}>
          <div style={styles.logoFrame}>
            <img 
              src="/clipart3301619.png" 
              alt="CSU Viking" 
              style={styles.logo} 
            />
          </div>
          <h1 style={styles.title}>Join the Crew</h1>
          <p style={styles.subtitle}>CSU Rehabilitation Device Directory</p>
        </header>

        {/* REGISTRATION FORM */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>University Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="viking@csuohio.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signUp()}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signUp()}
            />
          </div>

          <button style={styles.primaryButton} onClick={signUp}>
            Create Account 🛡️
          </button>
        </div>

        {/* FEEDBACK STATUS */}
        {msg && (
          <div style={{
            ...styles.statusMessage, 
            backgroundColor: msg.includes("Error") ? "#fee2e2" : "#f0fdf4",
            color: msg.includes("Error") ? "#991b1b" : "#006747"
          }}>
            {msg}
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <footer style={styles.footer}>
          <button style={styles.secondaryButton} onClick={() => router.push("/login")}>
            Already have an account? Sign In
          </button>
          
          <button style={styles.backButton} onClick={() => router.push("/")}>
            ← Back to Home
          </button>
        </footer>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#006747", // CSU Green
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "inherit"
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "24px",
    border: "6px solid #E5A823", // CSU Gold
    boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
    textAlign: "center"
  },
  header: {
    marginBottom: "30px"
  },
  logoFrame: {
    width: "90px",
    height: "auto",
    margin: "0 auto 15px"
  },
  logo: {
    width: "100%",
    height: "auto",
    objectFit: "contain"
  },
  title: {
    color: "#006747",
    fontSize: "30px",
    fontWeight: 900,
    margin: 0
  },
  subtitle: {
    color: "#475569",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "5px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontWeight: 800,
    color: "#1e293b",
    fontSize: "14px",
    paddingLeft: "4px"
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "2px solid #cbd5e1",
    fontSize: "16px",
    boxSizing: "border-box"
  },
  primaryButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#006747",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 5px 0 #004d35"
  },
  statusMessage: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px"
  },
  footer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#006747",
    border: "2px solid #006747",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "14px"
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#64748b",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600
  }
};