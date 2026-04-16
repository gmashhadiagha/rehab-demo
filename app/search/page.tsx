"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Device = {
  id: string;
  name: string;
  device_type: string | null;
  description: string | null;
  size_notes: string | null;
  city: string | null;
  condition: string | null;
  availability_status: string | null;
  age_range: string | null;
  manufacturer: string | null;
  image_url: string | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");
  const [condition, setCondition] = useState("");

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function searchDevices() {
    setLoading(true);
    setHasSearched(true);

    let queryBuilder = supabase.from("device_listing").select("*");

    if (query.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    if (deviceType) {
      queryBuilder = queryBuilder.eq("device_type", deviceType);
    }

    if (city.trim()) {
      queryBuilder = queryBuilder.ilike("city", `%${city}%`);
    }

    if (availability) {
      queryBuilder = queryBuilder.eq("availability_status", availability);
    }

    if (condition) {
      queryBuilder = queryBuilder.eq("condition", condition);
    }

    const { data, error } = await queryBuilder.order("created_at", {
      ascending: false,
    });

    if (!error && data) {
      setDevices(data);
    } else {
      console.error(error);
      setDevices([]);
    }

    setLoading(false);
  }

  function clearFilters() {
    setQuery("");
    setDeviceType("");
    setCity("");
    setAvailability("");
    setCondition("");
    setDevices([]);
    setHasSearched(false);
  }

  return (
    <main style={{ padding: "60px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", color: "#006747", marginBottom: "20px" }}>
        Rehabilitation Device Directory
      </h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search by device name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">All device types</option>
            <option value="Walker">Walker</option>
            <option value="Wheelchair">Wheelchair</option>
            <option value="Brace">Brace</option>
            <option value="Crutches">Crutches</option>
            <option value="Bathing">Bathing</option>
            <option value="Toileting">Toileting</option>
            <option value="Positioning">Positioning</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">All availability</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="unavailable">Unavailable</option>
            <option value="donated">Donated</option>
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">All conditions</option>
            <option value="new">New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={searchDevices}
            style={{
              padding: "12px 30px",
              fontSize: "18px",
              backgroundColor: "#006747",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Search
          </button>

          <button
            onClick={clearFilters}
            style={{
              padding: "12px 30px",
              fontSize: "18px",
              backgroundColor: "#e9ecef",
              color: "#222",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}

      {!hasSearched && (
        <p style={{ marginTop: "30px", color: "#555" }}>
          Search by keyword and use filters to narrow results.
        </p>
      )}

      {hasSearched && !loading && devices.length === 0 && (
        <p style={{ marginTop: "30px", color: "#900" }}>
          No devices found matching your search.
        </p>
      )}

      {hasSearched && !loading && devices.length > 0 && (
        <p style={{ marginTop: "30px", color: "#006747", fontWeight: 600 }}>
          Found {devices.length} device{devices.length !== 1 ? "s" : ""}.
        </p>
      )}

      <div style={{ marginTop: "30px" }}>
        {devices.map((device) => (
          <div
            key={device.id}
            style={{
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#f4f9f6",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            {device.image_url && (
              <img
                src={device.image_url}
                alt={device.name}
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "14px",
                }}
              />
            )}

            <h3 style={{ marginBottom: "8px" }}>{device.name}</h3>

            <p style={{ marginBottom: "8px" }}>
              <strong>Type:</strong> {device.device_type || "Not listed"} •{" "}
              <strong>City:</strong> {device.city || "Not listed"}
            </p>

            <p style={{ marginBottom: "8px" }}>
              {device.description || "No description provided."}
            </p>

            <p style={{ marginBottom: "6px" }}>
              <strong>Size:</strong> {device.size_notes || "Not listed"}
            </p>

            <p style={{ marginBottom: "6px" }}>
              <strong>Condition:</strong> {device.condition || "Not listed"}
            </p>

            <p style={{ marginBottom: "6px" }}>
              <strong>Availability:</strong>{" "}
              {device.availability_status || "Not listed"}
            </p>

            <p style={{ marginBottom: "0" }}>
              <strong>Age Range:</strong> {device.age_range || "Not listed"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}