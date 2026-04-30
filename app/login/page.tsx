"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signIn() {
    if (!email || !password) return setMsg("Please enter email and password.");
    
    setMsg("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMsg("Error: " + error.message);
    } else {
      setMsg("Success. Redirecting...");
      router.push("/dashboard");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.loginCard}>
        <header style={styles.header}>
          <img 
            src="/clipart3301619.png" 
            alt="CSU Viking" 
            style={styles.vikingLogo} 
          />
          <h1 style={styles.title}>CSU Rehab Directory</h1>
          <p style={styles.subtitle}>Login to manage pediatric equipment</p>
        </header>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="viking@csuohio.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
            />
          </div>

          <button style={styles.primaryButton} onClick={signIn}>
            Sign In
          </button>
        </div>

        {msg && (
          <div style={{
            ...styles.statusMessage, 
            backgroundColor: msg.includes("Error") ? "#fee2e2" : "#f0fdf4",
            color: msg.includes("Error") ? "#991b1b" : "#006747"
          }}>
            {msg}
          </div>
        )}

        <footer style={styles.footer}>
          <Link href="/forgot-password" style={styles.footerLink}>Forgot password?</Link>
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
    padding: "20px"
  },
  loginCard: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    border: "6px solid #E5A823", // CSU Gold
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center"
  },
  header: {
    marginBottom: "30px"
  },
  vikingLogo: {
    width: "90px",
    height: "auto",
    marginBottom: "15px"
  },
  title: {
    color: "#006747",
    fontSize: "28px",
    fontWeight: 900,
    margin: 0
  },
  subtitle: {
    color: "#555",
    fontSize: "16px",
    marginTop: "5px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  label: {
    fontWeight: 800,
    color: "#333",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box"
  },
  primaryButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#006747",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 0 #004d35"
  },
  statusMessage: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "14px"
  },
  footer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  footerLink: {
    color: "#006747",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: "14px"
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px"
  }
};