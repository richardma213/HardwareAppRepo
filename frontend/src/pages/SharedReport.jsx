import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SharedReport.css";
const API_URL = process.env.REACT_APP_API_URL;

export default function SharedReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`${API_URL}/api/shared/${id}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load report");
        }

        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  if (loading) return <p>Loading shared report…</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <div className="shared-report-page">
      <h1 className="shared-report-title">Shared Report</h1>

      <div className="shared-section">
        <h3>Weights Used</h3>
        {Object.entries(report.weights).map(([key, value]) => (
          <p key={key}><strong>{key}:</strong> {value}</p>
        ))}
      </div>

      <div className="shared-section">
        <h3>CPUs</h3>
        {report.cpus.map((cpu, i) => (
          <p key={i}>
            <strong>{cpu.name}</strong> — Score: {cpu.normalizedScore}
          </p>
        ))}
      </div>

      <div className="shared-section">
        <h3>GPUs</h3>
        {report.gpus.map((gpu, i) => (
          <p key={i}>
            <strong>{gpu.name}</strong> — Score: {gpu.normalizedScore}
          </p>
        ))}
      </div>
       <br/><br/><br/>
    </div>


  );
}
