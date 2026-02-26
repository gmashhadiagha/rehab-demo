"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function searchDevices() {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from("device_listing")
      .select("*")
      .ilike("name", `%${query}%`);

    if (!error && data) {
      setDevices(data);
    } else {
      setDevices([]);
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: "60px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", color: "#006747" }}>
        Rehabilitation Device Directory
      </h1>

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Search by device name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={searchDevices}
          style={{
            marginTop: "15px",
            padding: "12px 30px",
            fontSize: "18px",
            backgroundColor: "#006747",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}

      {!hasSearched && (
        <p style={{ marginTop: "30px", color: "#555" }}>
          Enter a device name and click Search.
        </p>
      )}

      {hasSearched && !loading && devices.length === 0 && (
        <p style={{ marginTop: "30px", color: "#900" }}>
          No devices found.
        </p>
      )}

      <div style={{ marginTop: "40px" }}>
        {devices.map((device) => (
          <div
            key={device.id}
            style={{
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#f4f9f6",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            <h3 style={{ marginBottom: "5px" }}>{device.name}</h3>
            <p>{device.device_type} • {device.city}</p>
            <p>{device.description}</p>
            <p><strong>Size:</strong> {device.size_notes}</p>
          </div>
        ))}
      </div>
    </main>
  );
}