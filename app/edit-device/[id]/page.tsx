"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function EditDevicePage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [description, setDescription] = useState("");
  const [sizeNotes, setSizeNotes] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [ageRange, setAgeRange] = useState("");

  useEffect(() => {
    async function loadDevice() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("device_listing")
        .select("*")
        .eq("id", deviceId)
        .single();

      if (error || !data) {
        setMsg("Could not load device.");
        setLoading(false);
        return;
      }

      setName(data.name || "");
      setDeviceType(data.device_type || "");
      setDescription(data.description || "");
      setSizeNotes(data.size_notes || "");
      setCity(data.city || "");
      setCondition(data.condition || "");
      setAvailabilityStatus(data.availability_status || "available");
      setAgeRange(data.age_range || "");
      setLoading(false);
    }

    if (deviceId) {
      loadDevice();
    }
  }, [deviceId, router]);

  async function updateDevice() {
    setSaving(true);
    setMsg("");

    const { error } = await supabase
      .from("device_listing")
      .update({
        name,
        device_type: deviceType,
        description,
        size_notes: sizeNotes,
        city,
        condition,
        availability_status: availabilityStatus,
        age_range: ageRange,
      })
      .eq("id", deviceId);

    setSaving(false);

    if (error) {
      setMsg("Error updating device.");
      return;
    }

    router.push("/dashboard");
  }

  if (loading) {
    return <main style={{ padding: "40px" }}>Loading device...</main>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f9f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "550px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#006747", marginBottom: "20px" }}>Edit Device</h2>

        <input
          placeholder="Device name"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Device type"
          style={inputStyle}
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        />

        <textarea
          placeholder="Description"
          style={{ ...inputStyle, minHeight: "90px" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Size notes"
          style={inputStyle}
          value={sizeNotes}
          onChange={(e) => setSizeNotes(e.target.value)}
        />

        <input
          placeholder="City"
          style={inputStyle}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <select
          style={inputStyle}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="used">Used</option>
        </select>

        <select
          style={inputStyle}
          value={availabilityStatus}
          onChange={(e) => setAvailabilityStatus(e.target.value)}
        >
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="unavailable">Unavailable</option>
          <option value="donated">Donated</option>
          <option value="sold">Sold</option>
        </select>

        <input
          placeholder="Age range"
          style={inputStyle}
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        />

        <button
          onClick={updateDevice}
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#006747",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Update Device"}
        </button>

        {msg && <p style={{ marginTop: "12px", color: "#900" }}>{msg}</p>}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};