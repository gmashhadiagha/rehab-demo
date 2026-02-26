"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function AddDevicePage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [description, setDescription] = useState("");
  const [sizeNotes, setSizeNotes] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
    };

    checkUser();
  }, [router]);

  async function addDevice() {
    if (!userId) {
      setMsg("Not logged in.");
      return;
    }

    if (!name.trim()) {
      setMsg("Device name is required.");
      return;
    }

    setLoading(true);
    setMsg("Saving...");

    const { error } = await supabase.from("device_listing").insert([
      {
        owner_id: userId,
        name,
        device_type: deviceType,
        description,
        size_notes: sizeNotes,
        city,
      },
    ]);

    setLoading(false);

    if (error) {
      setMsg("Error: " + error.message);
      return;
    }

    setMsg("Saved successfully!");
    router.push("/");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
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
        width: "400px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ color: "#006747" }}>Add Your Device</h2>
          <button onClick={handleSignOut} style={{
            background: "none",
            border: "none",
            color: "#006747",
            cursor: "pointer"
          }}>
            Sign out
          </button>
        </div>

        <input placeholder="Device name (required)"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input placeholder="Device type"
          style={inputStyle}
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        />

        <textarea placeholder="Description"
          style={inputStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input placeholder="Size notes"
          style={inputStyle}
          value={sizeNotes}
          onChange={(e) => setSizeNotes(e.target.value)}
        />

        <input placeholder="City"
          style={inputStyle}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={addDevice}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#006747",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginTop: "10px",
            cursor: "pointer"
          }}
        >
          {loading ? "Saving..." : "Save Device"}
        </button>

        {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};