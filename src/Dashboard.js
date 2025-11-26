import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);
  const [message, setMessage] = useState("");


  const [health, setHealth] = useState("");
const [checkingHealth, setCheckingHealth] = useState(false);

const checkHealth = async () => {
  setCheckingHealth(true);
  setHealth("");
  try {
    const res = await axios.get("http://localhost:3000/healthz");
    if (res.data.ok) setHealth("🟢 Server Healthy");
    else setHealth("🟡 Server Responded But Not OK");
  } catch (err) {
    setHealth("🔴 Server Down");
  }
  setCheckingHealth(false);
};

  // Load all existing short links
  const loadLinks = async () => {
    try {
      const res = await axios.get(`${API}/links`);
      setLinks(res.data);
      console.log(res)
    } catch (err) {
      console.error("Error loading links:", err);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // Create Short Link
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API}/links`, { url, code });

      setMessage("Short link created successfully!");
      setUrl("");
      setCode("");

      // Refresh list
      loadLinks();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating link");
    }
  };

  // Copy short link
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // Delete link
  const handleDelete = async (shortCode) => {
    if (!window.confirm(`Delete ${shortCode}?`)) return;

    try {
      await axios.delete(`${API}/links/${shortCode}`);
      loadLinks();
    } catch (err) {
      alert("Failed to delete link.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 20 }}>TinyLink Dashboard</h1>

      {/* Create Short Link */}
      <div style={{ marginBottom: 40 }}>
        <form onSubmit={handleCreate}>
          <div>
            <label>Target URL *</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                marginTop: 5,
                marginBottom: 15,
              }}
            />
          </div>

          <div>
            <label>Custom Code (6-8 chars)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 5,
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create
          </button>

          {message && (
            <p style={{ marginTop: 10, color: "green" }}>{message}</p>
          )}
        </form>
      </div>
      <div style={{ marginBottom: 20 }}>
  <button
    onClick={checkHealth}
    style={{
      padding: "10px 15px",
      background: "#28a745",
      color: "white",
      border: "none",
      cursor: "pointer",
      borderRadius: 5,
      marginRight: 10
    }}
  >
    {checkingHealth ? "Checking..." : "Check Server Health"}
  </button>

  {health && (
    <span style={{ fontSize: 16, marginLeft: 10 }}>
      {health}
    </span>
  )}
</div>

      {/* Links Table */}
      <h2>All Short Links</h2>

      <table
        width="100%"
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", marginTop: 15 }}
      >
        <thead>
          <tr>
            <th>Code</th>
            <th>URL</th>
            <th>Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => {
            const shortUrl = `http://localhost:3000/${link.code}`;
            console.log(shortUrl)
            return (
              <tr key={link.code}>
                <td>
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {link.code}
                  </a>
                </td>

                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {link.url}
                </td>

                <td style={{ textAlign: "center" }}>{link.totalclicks}</td>

                <td style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleCopy(shortUrl)}>Copy</button>

                  <button
                    onClick={() => handleDelete(link.code)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>

                  <a href={`/stats/${link.code}`}>Stats</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
