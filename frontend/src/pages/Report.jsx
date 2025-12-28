import "./Report.css";

// Class page for report
export default function Report() {
  return (
    <div className="report-page">

      <section className="report-hero">
        <h1 className="report-title">Performance Report</h1>
        <p className="report-subtitle">View your CPU and GPU comparison results</p>
      </section>

      <section className="report-content">
        <div className="report-card">
          <h2>CPU Comparison</h2>
          <p>No CPUs selected yet.</p>
        </div>

        <div className="report-card">
          <h2>GPU Comparison</h2>
          <p>No GPUs selected yet.</p>
        </div>

        <div className="report-card">
          <h2>Overall System Summary</h2>
          <p>Your combined performance results will appear here.</p>
        </div>
      </section>

    </div>
  );
}
