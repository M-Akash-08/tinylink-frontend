import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API = "https://tinylink-backend-ef8p.onrender.com/api";

function Stats() {
  const { code } = useParams();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/links/${code}`)
      .then((res) => {
        const d = res.data;
        // console.log(d);
        // Normalize backend fields
        const normalized = {
          code: d.code,
          url: d.url,
          totalclicks: d.totalclicks ?? d.totalclicks ?? 0,
          createdat: d.createdat ?? d.createdat ?? null,
          lastclickedat: d.lastclickedat ?? d.lastclicked_at ?? null,
        };

        setInfo(normalized);
      })
      .catch(() => {
        setError("Stats not found for this code.");
      });
  }, [code]);

  if (error) return <h2>{error}</h2>;
  if (!info) return <h2>Loading stats...</h2>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Stats for: {info.code}</h1>

      <div style={{ marginTop: 20 }}>
        <p>
          <b>Short URL:</b> http://localhost:3000/{info.code}
        </p>

        <p>
          <b>Original URL:</b>{" "}
          <a href={info.url} target="_blank" rel="noreferrer">
            {info.url}
          </a>
        </p>

        <p>
          <b>Total Clicks:</b> {info.totalclicks}
        </p>

        <p>
          <b>Created At:</b>{" "}
          {info.createdAt
            ? new Date(info.createdat).toLocaleString()
            : "Unknown"}
        </p>

        <p>
          <b>Last Clicked At:</b>{" "}
          {info.lastClickedAt
            ? new Date(info.lastclickedat).toLocaleString()
            : "Never clicked yet"}
        </p>
      </div>

      <Link to="/" style={{ marginTop: 20, display: "inline-block" }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default Stats;
