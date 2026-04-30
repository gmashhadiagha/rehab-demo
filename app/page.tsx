"use client";

import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  const [smartInput, setSmartInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(searchText?: string) {
    setHasSearched(true);

    const q = (searchText ?? smartInput).trim();

    if (!q) {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from("device_listing")
      .select("*")
      .or(
        `name.ilike.%${q}%,description.ilike.%${q}%,device_type.ilike.%${q}%,city.ilike.%${q}%,condition.ilike.%${q}%,manufacturer.ilike.%${q}%`
      );

    if (error) {
      alert("Search error: " + error.message);
      setResults([]);
      return;
    }

    setResults(data || []);
  }



function toggleListening() {
    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Speech not supported");
      return;
    }

  const recognition = new SpeechRec();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;

      setSmartInput(transcript);

      // 🔥 THIS is what you were missing
      await handleSearch(transcript);
    };

    recognition.onerror = (e: any) => {
      alert("Mic error: " + e.error);
    };

    recognition.start();
  }
  

  return (
    <main style={styles.page}>
      <div style={styles.heroRow}>
        
        {/* LEFT SIDE LOGO */}
        <div style={styles.logoWrapper}>
          <img src="/logo.png" alt="Move & Play" style={styles.mainLogo} />
        </div>

        {/* RIGHT SIDE SEARCH */}
        <div style={styles.container}>
          {/* Assistant Box */}
          <section style={styles.assistantBox}>
            <div style={styles.assistantTop}>
              <p style={styles.bubbleText}>
                Search for pediatric rehabilitation equipment like walkers,
                standers, gait trainers, or adaptive bikes.
              </p>

              <button onClick={toggleListening} style={styles.micBtn}>
            🎤 Speak
          </button>
            </div>
          </section>

          {/* Search */}
          <section style={styles.searchSection}>
            <div style={styles.inputRow}>
              <input
                style={styles.bigInput}
                placeholder="Search by device, category, or city..."
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />

              <button onClick={handleSearch} style={styles.findBtn}>
                SEARCH
              </button>
            </div>
          </section>

          {/* Results */}
          <section style={styles.resultsSection}>
            {hasSearched && results.length === 0 && (
              <p style={styles.emptyText}>
                No matching devices found. Try “walker,” “stander,” or “Cleveland.”
              </p>
            )}

            {results.length > 0 && (
              <div>
                {results.map((device) => (
                  <div key={device.id} style={styles.resultCard}>
                    {device.image_url && (
                      <img
                        src={device.image_url}
                        alt={device.name}
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          marginBottom: "10px",
                        }}
                      />
                    )}

          <h3>{device.name}</h3>
          <p><strong>Type:</strong> {device.device_type}</p>
          <p><strong>City:</strong> {device.city}</p>
          <p><strong>Condition:</strong> {device.condition}</p>
          <p>{device.description}</p>
        </div>
      ))}
    </div>
  )}
</section>

        </div>

        {/* RIGHT SIDE LOGO */}
  

      </div>

      {/* FOOTER */}
      <footer style={styles.innerFooter}>
        © 2026 Cleveland State University Rehabilitation Technology Initiative
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#006747",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  heroRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "60px",
    maxWidth: "1300px",
    marginTop: "60px",
  },

  container: {
    width: "650px",
    backgroundColor: "#fff",
    borderRadius: "30px",
    padding: "40px",
    border: "6px solid #E5A823",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },

  assistantBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    border: "3px solid #006747",
    borderRadius: "20px",
    marginBottom: "20px",
  },

  bubbleText: {
    fontSize: "15px",
    fontWeight: 500,
  },

  micBtn: {
    backgroundColor: "#006747",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },

  searchSection: {
    marginBottom: "20px",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
  },

  bigInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #ccc",
  },

  findBtn: {
    backgroundColor: "#006747",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  resultsSection: {
    marginTop: "10px",
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
  },

  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  mainLogo: {
    width: "1000px",
    height: "auto",
  },

  innerFooter: {
    marginTop: "50px",
    marginBottom: "10px",
    color: "#f4b400",
    fontSize: "13px",
  },
  assistantTop: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
},
};