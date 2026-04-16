"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setUser(data.user);
        router.push("/dashboard"); // 👈 redirect if logged in
      } else {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);

  if (loading) {
    return <main style={{ padding: "40px" }}>Loading...</main>;
  }

  return (
    <main style={{ textAlign: "center", padding: "80px" }}>
      <h1 style={{ fontSize: "40px", color: "#006747" }}>
        CSU Rehabilitation Device Directory
      </h1>

      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        A centralized platform for searching and managing rehabilitation equipment.
      </p>

      <div style={{ marginTop: "40px" }}>
        <button onClick={() => router.push("/login")} style={btn}>
          Sign In
        </button>

        <button onClick={() => router.push("/signup")} style={btnOutline}>
          Create Account
        </button>

        <button onClick={() => router.push("/search")} style={btn}>
          Search Devices
        </button>
      </div>
    </main>
  );
}

const btn = {
  margin: "10px",
  padding: "12px 25px",
  backgroundColor: "#006747",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnOutline = {
  margin: "10px",
  padding: "12px 25px",
  backgroundColor: "white",
  color: "#006747",
  border: "2px solid #006747",
  borderRadius: "6px",
  cursor: "pointer",
};