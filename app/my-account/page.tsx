"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function MyAccountPage() {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setDevices([]);
      return;
    }

    const { data, error } = await supabase
      .from("device_listing")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setDevices(data || []);
  }

  // ✅ DELETE FUNCTION (FIXED)
  async function deleteDevice(id: string) {
    const ok = confirm("Are you sure you want to delete this device?");
    if (!ok) return;

    const { error } = await supabase
      .from("device_listing")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    fetchDevices(); // refresh list
  }

  return (
    <main style={{ padding: "30px" }}>
      <h1 style={{ color: "#006747" }}>My Devices</h1>

      {devices.length === 0 ? (
        <p>No devices added yet.</p>
      ) : (
        devices.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>

            {item.image_url && (
              <img
                src={item.image_url}
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            {/* ✅ ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              
              {/* EDIT */}
              <Link href={`/edit-device/${item.id}`}>
                <button style={buttonStyle}>✏️ Edit</button>
              </Link>

              {/* DELETE */}
              <button
                onClick={() => deleteDevice(item.id)}
                style={deleteStyle}
              >
                🗑 Delete
              </button>

            </div>
          </div>
        ))
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "16px",
  background: "#fff",
};

const buttonStyle: React.CSSProperties = {
  background: "#F6D365",
  border: "2px solid #006747",
  borderRadius: "10px",
  padding: "8px 12px",
  cursor: "pointer",
};

const deleteStyle: React.CSSProperties = {
  background: "#ffcccc",
  border: "2px solid #cc0000",
  borderRadius: "10px",
  padding: "8px 12px",
  cursor: "pointer",
};