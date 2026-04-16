"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type Device = {
  id: string;
  name: string | null;
  device_type: string | null;
  city: string | null;
  condition: string | null;
  availability_status: string | null;
  image_url: string | null;
  age_range: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      const currentUserId = authData.user.id;
      setUserId(currentUserId);

      const { data, error } = await supabase
        .from("device_listing")
        .select("*")
        .eq("owner_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        setMsg("Error loading your devices.");
        setDevices([]);
      } else {
        setDevices(data || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function deleteDevice(deviceId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this device?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("device_listing")
      .delete()
      .eq("id", deviceId);

    if (error) {
      setMsg("Could not delete device.");
      return;
    }

    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
  }

  async function markUnavailable(deviceId: string) {
    const { error } = await supabase
      .from("device_listing")
      .update({ availability_status: "unavailable" })
      .eq("id", deviceId);

    if (error) {
      setMsg("Could not update device.");
      return;
    }

    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, availability_status: "unavailable" }
          : device
      )
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f9f6",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1 style={{ color: "#006747", marginBottom: "8px" }}>My Dashboard</h1>
            <p style={{ color: "#555", margin: 0 }}>
              Manage your rehabilitation device listings.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/add-device"
              style={{
                padding: "12px 18px",
                backgroundColor: "#006747",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Add New Device
            </Link>

            <Link
              href="/search"
              style={{
                padding: "12px 18px",
                backgroundColor: "white",
                color: "#006747",
                textDecoration: "none",
                borderRadius: "8px",
                border: "1px solid #006747",
                fontWeight: 600,
              }}
            >
              Search Devices
            </Link>

            <button
              onClick={handleSignOut}
              style={{
                padding: "12px 18px",
                backgroundColor: "transparent",
                color: "#006747",
                border: "1px solid #006747",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        {msg && (
          <p style={{ marginBottom: "20px", color: "#900" }}>
            {msg}
          </p>
        )}

        {loading ? (
          <p>Loading your devices...</p>
        ) : devices.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>No listings yet</h2>
            <p style={{ color: "#555" }}>
              You have not added any devices yet.
            </p>
            <Link
              href="/add-device"
              style={{
                display: "inline-block",
                marginTop: "12px",
                padding: "12px 18px",
                backgroundColor: "#006747",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Add Your First Device
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {devices.map((device) => (
              <div
                key={device.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "18px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                {device.image_url && (
                  <img
                    src={device.image_url}
                    alt={device.name || "Device image"}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "14px",
                    }}
                  />
                )}

                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                  {device.name || "Unnamed device"}
                </h3>

                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Type:</strong> {device.device_type || "Not listed"}
                </p>

                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>City:</strong> {device.city || "Not listed"}
                </p>

                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Condition:</strong> {device.condition || "Not listed"}
                </p>

                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Availability:</strong>{" "}
                  {device.availability_status || "Not listed"}
                </p>

                <p style={{ margin: "0 0 16px 0" }}>
                  <strong>Age Range:</strong> {device.age_range || "Not listed"}
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link
                    href={`/edit-device/${device.id}`}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#006747",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      display: "inline-block",
                    }}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => markUnavailable(device.id)}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#e9ecef",
                      color: "#222",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Mark Unavailable
                  </button>

                  <button
                    onClick={() => deleteDevice(device.id)}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#fff0f0",
                      color: "#900",
                      border: "1px solid #f0caca",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}