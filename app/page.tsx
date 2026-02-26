export default function Home() {
  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px"
      }}
    >
      <h1
        style={{
          fontSize: "44px",
          color: "#006747",
          marginBottom: "10px"
        }}
      >
        CSU Rehabilitation Device Directory
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "50px" }}>
        A centralized platform for searching and managing rehabilitation equipment.
      </p>

      <div>
        <a href="/login">
          <button style={buttonStyle}>Sign In</button>
        </a>

        <a href="/signup">
          <button style={buttonStyleSecondary}>Create Account</button>
        </a>

        <a href="/search">
          <button style={buttonStyle}>Search Devices</button>
        </a>
      </div>

      <p style={{ marginTop: "30px", color: "#666", fontSize: "15px" }}>
        Existing users may sign in. New users can create an account to add and manage devices.
      </p>
    </main>
  );
}

const buttonStyle = {
  padding: "16px 36px",
  fontSize: "18px",
  margin: "12px",
  backgroundColor: "#006747",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const buttonStyleSecondary = {
  padding: "16px 36px",
  fontSize: "18px",
  margin: "12px",
  backgroundColor: "white",
  color: "#006747",
  border: "2px solid #006747",
  borderRadius: "8px",
  cursor: "pointer"
};