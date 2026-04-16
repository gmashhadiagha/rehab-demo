"use client";

import { ChangeEvent, useEffect, useState } from "react";
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
  const [condition, setCondition] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [ageRange, setAgeRange] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

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

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("device-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setLoading(false);
        setMsg("Image upload failed: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("device-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("device_listing").insert([
      {
        owner_id: userId,
        name,
        device_type: deviceType,
        description,
        size_notes: sizeNotes,
        city,
        condition,
        availability_status: availabilityStatus,
        age_range: ageRange,
        image_url: imageUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      setMsg("Error: " + error.message);
      return;
    }

    setMsg("Saved successfully!");
    router.push("/search");
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
      alignItems: "center",
      padding: "30px"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "550px",
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

        <input placeholder="Device name (required)" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Device type" style={inputStyle} value={deviceType} onChange={(e) => setDeviceType(e.target.value)} />
        <textarea placeholder="Description" style={{ ...inputStyle, minHeight: "90px" }} value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Size notes" style={inputStyle} value={sizeNotes} onChange={(e) => setSizeNotes(e.target.value)} />
        <input placeholder="City" style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} />

        <select style={inputStyle} value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="used">Used</option>
        </select>

        <select style={inputStyle} value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="unavailable">Unavailable</option>
          <option value="donated">Donated</option>
        </select>

        <input placeholder="Age range (example: 3-5 or 10-12)" style={inputStyle} value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />

        {/* 📎 CLIP STYLE UPLOAD */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Upload device photo
          </label>

          <label htmlFor="device-photo" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            border: "1px dashed #006747",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#f8f9fa"
          }}>
            <span>📎</span>
            <span>Attach photo</span>
          </label>

          <input
            id="device-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {imageFile && (
            <p style={{ marginTop: "8px" }}>Selected: {imageFile.name}</p>
          )}

          {preview && (
            <img src={preview} style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              marginTop: "10px",
              borderRadius: "8px"
            }} />
          )}
        </div>

        <button onClick={addDevice} disabled={loading} style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#006747",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
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