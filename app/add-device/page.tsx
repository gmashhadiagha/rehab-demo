"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddDevicePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [weightLimit, setWeightLimit] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [contactMethod, setContactMethod] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleAddDevice(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Saving device...");

    let imageUrl = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("device-images")
        .upload(fileName, image);

      if (uploadError) {
        setMessage("Image upload failed: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("device-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { data: userData } = await supabase.auth.getUser();

    const userId = userData.user?.id;

    if (!userId) {
      setMessage("You must be logged in to save a device.");
      return;
    }

    const { error } = await supabase.from("device_listing").insert([
      {
        name,
        description,
        device_type: deviceType,
        city,
        condition,
        manufacturer,
        model_number: modelNumber,
        age_range: ageRange,
        weight_limit: weightLimit,
        availability_status: availabilityStatus,
        pickup_notes: pickupNotes,
        contact_method: contactMethod,
        image_url: imageUrl,
        owner_id: userId,
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Device added successfully!");
    setName("");
    setDescription("");
    setImage(null);
    setPreview("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f2f1",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          padding: "32px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#006747", marginTop: 0 }}>Add Device</h1>
        <p style={{ color: "#475569" }}>
          Add a rehabilitation device with a name, description, and image.
        </p>

        <form onSubmit={handleAddDevice}>
          <label style={{ fontWeight: 700 }}>Device Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Example: Pediatric Walker"
            style={inputStyle}
          />

          <label style={{ fontWeight: 700 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the device, size, condition, and notes..."
            rows={5}
            style={inputStyle}
          />

          <label style={{ fontWeight: 700 }}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={inputStyle}
          />

            <label>Device Type</label>
            <input value={deviceType} onChange={(e) => setDeviceType(e.target.value)} style={inputStyle} />

            <label>City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />

            <label>Condition</label>
            <input value={condition} onChange={(e) => setCondition(e.target.value)} style={inputStyle} />

            <label>Manufacturer</label>
            <input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} style={inputStyle} />

            <label>Model Number</label>
            <input value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} style={inputStyle} />

            <label>Age Range</label>
            <input value={ageRange} onChange={(e) => setAgeRange(e.target.value)} style={inputStyle} />

            <label>Weight Limit</label>
            <input value={weightLimit} onChange={(e) => setWeightLimit(e.target.value)} style={inputStyle} />

            <label>Availability Status</label>
            <input value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} style={inputStyle} />

            <label>Pickup Notes</label>
            <textarea value={pickupNotes} onChange={(e) => setPickupNotes(e.target.value)} style={inputStyle} />

            <label>Contact Method</label>
            <input value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} style={inputStyle} />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "16px",
                marginTop: "12px",
                border: "1px solid #ddd",
              }}
            />
          )}

          <button
            type="submit"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: "#006747",
              color: "white",
              fontSize: "18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Device
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "16px", fontWeight: 700, color: "#006747" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};