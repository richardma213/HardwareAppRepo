import "./SavedReports.css";

export function ReportCard({ report, onLoad, onDelete, shareLink }) {
  const { weights, cpus, gpus, createdAt } = report;

  return (
    <div className="report-card-final">
      <div className="report-header">
        <h2>Saved Report — {new Date(createdAt).toLocaleString()}</h2>
      </div>

      <div className="report-actions">
        <button onClick={() => onLoad(report)} className="save-report-button">
          Load Report
        </button>
        <button onClick={() => onDelete(report._id)} className="delete-report-button">
          Delete
        </button>

        {shareLink && (
          <button
            className="copy-link-btn"
            onClick={() => {navigator.clipboard.writeText(shareLink)
              alert("copied share link!");}
            }
          >
            Copy Share Link
          </button>
        )}

      </div>

      <div className="report-list">

        {/* WEIGHTS USED */}
        <div className="report-item">
          <h3>Weights Used</h3>

          <p><strong>CPU Weights</strong></p>
          <p>Clock Speed: {weights.clockSpeed}</p>
          <p>Cores: {weights.cores}</p>
          <p>Threads: {weights.threads}</p>
          <p>Efficiency (TDP): {weights.efficiency}</p>

          <p style={{ marginTop: "1rem" }}><strong>GPU Weights</strong></p>
          <p>Clock Speed: {weights.clock}</p>
          <p>VRAM: {weights.vram}</p>
          <p>Efficiency (TDP): {weights.efficiencyGPU}</p>
        </div>

        {/* CPU SUMMARY */}
        {cpus.length > 0 && (
          <div className="report-item">
            <h3>CPU Summary</h3>
            {cpus.map(cpu => (
              <p key={cpu.id}>
                <strong>{cpu.name}</strong> — {cpu.cores}C/{cpu.threads}T,
                Boost {cpu.boostClock}, TDP {cpu.tdp}W,
                Score {cpu.normalizedScore}%
              </p>
            ))}
          </div>
        )}

        {/* GPU SUMMARY */}
        {gpus.length > 0 && (
          <div className="report-item">
            <h3>GPU Summary</h3>
            {gpus.map(gpu => (
              <p key={gpu.id}>
                <strong>{gpu.name}</strong> — {gpu.vram}GB VRAM,
                Boost {gpu.boostClock}, TDP {gpu.tdp}W,
                Score {gpu.normalizedScore}%
              </p>
            ))}
          </div>
        )}

        {/* OVERALL SUMMARY */}
        {(cpus.length > 0 || gpus.length > 0) && (
          <div className="report-item">
            <h3>Overall System Summary</h3>
            <p>{cpus.length > 0 && `• ${cpus.length} CPU(s) selected`}</p>
            <p>{gpus.length > 0 && `• ${gpus.length} GPU(s) selected`}</p>
            <p>Scores are normalized within each category for fair comparison.</p>
          </div>
        )}

      </div>
    </div>
  );
}
