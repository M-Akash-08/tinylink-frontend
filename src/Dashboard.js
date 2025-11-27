import React, { useEffect, useState } from "react";
import axios from "axios";

// USE BACKEND URL INSTEAD OF LOCALHOST
const API = "https://tinylink-backend-ef8p.onrender.com/api";

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
      const res = await axios.get("https://tinylink-backend-ef8p.onrender.com/healthz");
      if (res.data.ok) setHealth("🟢 Server Healthy");
      else setHealth("🟡 Server Responded But Not OK");
    } catch (err) {
      setHealth("🔴 Server Down");
    }
    setCheckingHealth(false);
  };

  // Load links + normalize backend field names
  const loadLinks = async () => {
    try {
      const res = await axios.get(`${API}/links`);

      const normalized = res.data.map((d) => ({
        code: d.code,
        url: d.url,
        totalClicks: d.totalClicks ?? d.totalclicks ?? 0,
        createdAt: d.createdAt ?? d.createdat,
        lastClickedAt: d.lastClickedAt ?? d.lastclickedat,
      }));

      setLinks(normalized);
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
      const res = await axios.post(`${API}/links`, { url, code });

      const d = res.data;
      const newLink = {
        code: d.code,
        url: d.url,
        totalClicks: d.totalClicks ?? d.totalclicks ?? 0,
        createdAt: d.createdAt ?? d.createdat,
        lastClickedAt: d.lastClickedAt ?? d.lastclickedat,
      };

      setLinks([newLink, ...links]);

      setMessage("Short link created!");
      setUrl("");
      setCode("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error creating link");
    }
  };

  // Copy short link
  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
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
      <h1>TinyLink Dashboard</h1>

      {/* Create Link */}
      <form onSubmit={handleCreate} style={{ marginBottom: 30 }}>
        <label>Target URL *</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <label>Custom Code (optional)</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />

        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "blue",
            color: "white",
          }}
        >
          Create
        </button>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </form>

      {/* Server Health */}
      <button
        onClick={checkHealth}
        style={{
          padding: "10px 15px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {checkingHealth ? "Checking..." : "Check Server Health"}
      </button>
      <span style={{ marginLeft: 10 }}>{health}</span>

      {/* Links Table */}
      <h2 style={{ marginTop: 30 }}>All Short Links</h2>

      <table width="100%" border="1" cellPadding="10">
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
            const shortUrl = `https://tinylink-backend-ef8p.onrender.com/${link.code}`;

            return (
              <tr key={link.code}>
                <td>
                  <a href={shortUrl} target="_blank">{link.code}</a>
                </td>

                <td style={{ maxWidth: 300 }}>
                  {link.url}
                </td>

                <td style={{ textAlign: "center" }}>
                  {link.totalClicks}
                </td>

                <td style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => handleCopy(shortUrl)}>Copy</button>
                  <button onClick={() => handleDelete(link.code)} style={{ color: "red" }}>
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
