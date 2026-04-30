"use client";

import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav style={navStyle}>
      
      {/* LEFT SIDE */}
      <div style={leftStyle}>
        <Link href="/" style={linkStyle}>
          Home
        </Link>

        <Link href="/resources" style={linkStyle}>
          Resources
        </Link>

        <a href="mailto:g.mashhadiagha@vikes.csuohio.edu" style={linkStyle}>
          Contact
        </a>
      </div>

      {/* RIGHT SIDE */}
      <div style={rightStyle}>
        <Link href="/add-device" style={addButtonStyle}>
          + Add Device
        </Link>

        <Link href="/my-account" style={linkStyle}>
          My Account
        </Link>

        <button onClick={handleLogout} style={logoutStyle}>
          Sign Out
        </button>
         <Link href="/login" style={linkStyle}>
        Sign In
      </Link>

      <Link href="/signup" style={addButtonStyle}>
        Sign Up
      </Link>
      </div>

    </nav>
  );
}

const [user, setUser] = useState<any>(null);

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });
}, []);
const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 40px",
  background: "#006747",
  color: "white",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const leftStyle: React.CSSProperties = {
  display: "flex",
  gap: "24px",
  alignItems: "center",
};

const rightStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "15px",
};

const addButtonStyle: React.CSSProperties = {
  background: "#F4B400",
  color: "#000",
  padding: "8px 14px",
  borderRadius: "20px",
  textDecoration: "none",
  fontWeight: 700,
};

const logoutStyle: React.CSSProperties = {
  background: "#eee",
  border: "none",
  borderRadius: "20px",
  padding: "6px 12px",
  fontWeight: 600,
  cursor: "pointer",
};