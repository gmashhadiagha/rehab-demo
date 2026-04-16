"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleReset() {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setMsg("Error sending email");
    } else {
      setMsg("Check your email!");
    }
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Forgot Password</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleReset}>Send Reset Link</button>

      {msg && <p>{msg}</p>}
    </main>
  );
}