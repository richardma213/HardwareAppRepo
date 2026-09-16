import { useEffect, useState } from "react";
import "./Leaderboard.css";
import Card from "../components/Card";

const API_URL = process.env.REACT_APP_API_URL;

export default function Leaderboard() {
  const [mostPopular, setMostPopular] = useState([]);
  const [popularBuilds, setPopularBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load leaderboard");
          setLoading(false);
          return;
        }

        setMostPopular(data.mostPopular || []);
        setPopularBuilds(data.popularBuilds || []);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Network error while loading leaderboard.");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <section className="leaderboard-hero">
        <h1 className="leaderboard-title">Leaderboard 🏆</h1>
        <p className="leaderboard-subtitle">
          What the community is picking, aggregated across every saved report.
        </p>
      </section>

      {loading ? (
        <p className="leaderboard-status">Loading leaderboard…</p>
      ) : error ? (
        <p className="leaderboard-status leaderboard-error">{error}</p>
      ) : (
        <div className="leaderboard-content">

          {/* MOST POPULAR */}
          <Card className="leaderboard-card">
            <h2>Most Popular</h2>
            <p className="leaderboard-hint">
              Ranked by unique users who picked each part — not raw saves, so one
              person re-saving the same build repeatedly can't dominate the rank.
            </p>

            {mostPopular.length === 0 ? (
              <p className="empty-state">No data yet — save a report to be the first!</p>
            ) : (
              <ol className="leaderboard-list">
                {mostPopular.map((item, i) => (
                  <li key={item.id} className="leaderboard-row">
                    <span className="leaderboard-rank">#{i + 1}</span>
                    <span className="leaderboard-name">{item.name}</span>
                    <span className={`leaderboard-badge ${item.category === "GPU" ? "badge-gpu" : "badge-cpu"}`}>
                      {item.category}
                    </span>
                    <span className="leaderboard-count">
                      {item.uniqueUsers} {item.uniqueUsers === 1 ? "user" : "users"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          {/* POPULAR BUILDS */}
          <Card className="leaderboard-card">
            <h2>Popular Builds</h2>
            <p className="leaderboard-hint">
              CPU + GPU pairings that show up together most often in saved reports.
            </p>

            {popularBuilds.length === 0 ? (
              <p className="empty-state">No pairings yet — save a report with both a CPU and GPU!</p>
            ) : (
              <ol className="leaderboard-list">
                {popularBuilds.map((build, i) => (
                  <li key={`${build.cpuName}-${build.gpuName}`} className="leaderboard-row">
                    <span className="leaderboard-rank">#{i + 1}</span>
                    <span className="leaderboard-name">
                      {build.cpuName} <span className="leaderboard-plus">+</span> {build.gpuName}
                    </span>
                    <span className="leaderboard-count">
                      {build.pairs} {build.pairs === 1 ? "report" : "reports"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

        </div>
      )}
    </div>
  );
}
