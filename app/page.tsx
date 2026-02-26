"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabaseClient";

type DeviceListing = {
  id: string;
  name: string;
  device_type: string | null;
  description: string | null;
  size_notes: string | null;
  city: string | null;
  created_at: string;
};

export default function Home() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<DeviceListing[]>([]);
  const [loading, setLoading] = useState(false);

  async function runSearch(query: string) {
    setLoading(true);
    let s = supabase
      .from("device_listing")
      .select("*")
      .order("created_at", { ascending: false });

    if (query.trim()) {
      const esc = query.replaceAll("%", "\\%").replaceAll("_", "\\_");
      s = s.or(
        `name.ilike.%${esc}%,description.ilike.%${esc}%,device_type.ilike.%${esc}%,city.ilike.%${esc}%`
      );
    }

    const { data, error } = await s.limit(50);
    if (!error) setRows((data ?? []) as DeviceListing[]);
    setLoading(false);
  }

  useEffect(() => {
    runSearch("");
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1>Rehab Device Finder</h1>
        <Link href="/login">Login</Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: hand, ankle, small, Cleveland..."
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button onClick={() => runSearch(q)} style={{ padding: "10px 14px", fontSize: 16 }}>
          Search
        </button>
      </div>

      {loading ? <p>Loading…</p> : <p style={{ marginTop: 12 }}>{rows.length} results</p>}

      <ul style={{ marginTop: 12, padding: 0, listStyle: "none" }}>
        {rows.map((d) => (
          <li key={d.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>{d.name}</div>
            <div style={{ opacity: 0.8 }}>
              {d.device_type || "—"} {d.city ? `• ${d.city}` : ""}
            </div>
            <div style={{ marginTop: 6 }}>{d.description || ""}</div>
            {d.size_notes ? (
              <div style={{ marginTop: 6, fontStyle: "italic" }}>Size: {d.size_notes}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}