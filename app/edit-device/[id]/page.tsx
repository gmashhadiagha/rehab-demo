"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function EditDevicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    availability_status: "available",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDevice();
  }, [id]);

  async function fetchDevice() {
    const { data, error } = await supabase
      .from("device_listing")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Error loading device: " + error.message);
      setLoading(false);
      return;
    }

    setFormData({
      name: data.name || "",
      description: data.description || "",
      availability_status: data.availability_status || "available",
    });

    setLoading(false);
  }

  async function updateDevice() {
    const { error } = await supabase
      .from("device_listing")
      .update(formData)
      .eq("id", id);

    if (error) {
      alert("Update failed: " + error.message);
      return;
    }

    alert("Device updated!");
    router.push("/my-account"); // ✅ FIXED
  }

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading...</p>;
  }

  return (
    <main style={{ padding: "30px" }}>
      <h1 style={{ color: "#006747" }}>Edit Device</h1>

      <input
        type="text"
        placeholder="Device Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        style={styles.input}
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        style={styles.input}
      />

      {/* ✅ FIXED SELECT */}
      <select
        style={styles.input}
        value={formData.availability_status}
        onChange={(e) =>
          setFormData({
            ...formData,
            availability_status: e.target.value,
          })
        }
      >
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="unavailable">Unavailable</option>
        <option value="donated">Donated</option>
      </select>

      <button onClick={updateDevice} style={styles.button}>
        Save Changes
      </button>
    </main>
  );
}

const styles = {
  input: {
    display: "block",
    width: "100%",
    maxWidth: "500px",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#006747",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
  },
};