// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:3000/api";

// function App() {
//   const [url, setUrl] = useState("");
//   const [code, setCode] = useState("");
//   const [links, setLinks] = useState([]);
//   const [message, setMessage] = useState("");

//   // Load all links
//   const loadLinks = async () => {
//     try {
//       const res = await axios.get(`${API}/links`);
//       setLinks(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadLinks();
//   }, []);

//   // Create link
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const res = await axios.post(`${API}/links`, { url, code });
//       setMessage("Link created successfully!");
//       setUrl("");
//       setCode("");
//       loadLinks();
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Something went wrong");
//     }
//   };

//   // Copy helper
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert("Copied!");
//   };

//   // Delete link
//   const handleDelete = async (c) => {
//     if (!window.confirm(`Delete ${c}?`)) return;

//     try {
//       await axios.delete(`${API}/links/${c}`);
//       loadLinks();
//     } catch (err) {
//       alert("Error deleting link");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial" }}>
//       <h1>TinyLink Dashboard (React)</h1>

//       {/* Create short link */}
//       <form onSubmit={handleCreate} style={{ marginBottom: 30 }}>
//         <div>
//           <label>Target URL *</label>
//           <input
//             type="text"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             required
//             style={{ width: "100%", padding: 10, marginTop: 5 }}
//           />
//         </div>

//         <div style={{ marginTop: 15 }}>
//           <label>Custom Code (optional)</label>
//           <input
//             type="text"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder="6-8 characters"
//             style={{ width: "100%", padding: 10, marginTop: 5 }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             marginTop: 20,
//             padding: "10px 20px",
//             background: "#007bff",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Create
//         </button>

//         {message && <p style={{ marginTop: 10 }}>{message}</p>}
//       </form>

//       {/* Links Table */}
//       <h2>All Short Links</h2>
//       <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>Code</th>
//             <th>URL</th>
//             <th>Clicks</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {links.map((link) => (
//             <tr key={link.code}>
//               <td>
//                 <a href={`http://localhost:3000/${link.code}`} target="_blank" rel="noreferrer">
//                   {link.code}
//                 </a>
//               </td>

//               <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>
//                 {link.url}
//               </td>

//               <td style={{ textAlign: "center" }}>{link.totalClicks}</td>

//               <td style={{ display: "flex", gap: "10px" }}>
//                 <button onClick={() => copyToClipboard(`http://localhost:3000/${link.code}`)}>
//                   Copy
//                 </button>

//                 <button onClick={() => handleDelete(link.code)} style={{ color: "red" }}>
//                   Delete
//                 </button>

//                 <a href={`http://localhost:3000/code/${link.code}`} target="_blank" rel="noreferrer">
//                   Stats
//                 </a>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Stats from "./Stats";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats/:code" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
