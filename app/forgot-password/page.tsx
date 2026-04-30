"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleReset() {
    if (!email) {
      setMsg("Please enter your university email.");
      return;
    }

    setLoading(true);
    setMsg("Sending request...");

    // Replace 'http://localhost:3000' with your actual domain when you deploy
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    setLoading(false);

    if (error) {
      setMsg("Error: " + error.message);
    } else {
      setMsg("Success! Please check your inbox for the reset link.");
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
              alt="CSU Viking Mascot" 
              style={styles.logo} 
            />
          </div>
          <h1 style={styles.title}>Recovery</h1>
          <p style={styles.subtitle}>Reset your Directory Access</p>
        </header>

        {/* INPUT FORM */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>University Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="viking@csuohio.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
            />
          </div>

          <button 
            style={styles.primaryButton} 
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link 🛡️"}
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

        {/* FOOTER NAVIGATION */}
        <footer style={styles.footer}>
          <button style={styles.backButton} onClick={() => router.push("/login")}>
            ← Back to Login
          </button>
          
          <Link href="/" style={styles.homeLink}>
            Return to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}

// --- CSU Themed Styles ---
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#006747",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "24px",
    border: "6px solid #E5A823",
    boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
    textAlign: "center"
  },
  header: { marginBottom: "30px" },
  logoFrame: { width: "90px", height: "auto", margin: "0 auto 15px" },
  logo: { width: "100%", height: "auto", objectFit: "contain" },
  title: { color: "#006747", fontSize: "30px", fontWeight: 900, margin: 0 },
  subtitle: { color: "#475569", fontSize: "15px", fontWeight: 600, marginTop: "5px" },
  form: { display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: 800, color: "#1e293b", fontSize: "14px", paddingLeft: "4px" },
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
    boxShadow: "0 5px 0 #004d35",
    marginTop: "5px"
  },
  statusMessage: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px"
  },
  footer: { marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" },
  backButton: {
    backgroundColor: "transparent",
    color: "#006747",
    border: "2px solid #006747",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "14px"
  },
  homeLink: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "underline"
  }
};