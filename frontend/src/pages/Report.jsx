import "./Report.css";
import { useCompare } from "../components/CompareContext";
import { Link } from "react-router-dom";

// Class page for report
export default function Report() {

  const { cpuList, gpuList, removeCPU, removeGPU, weights } = useCompare();

  const removeAllCPUs = () => {
    cpuList.forEach(cpu => removeCPU(cpu.id));
  };

  const removeAllGPUs = () => {
    gpuList.forEach(gpu => removeGPU(gpu.id));
  };

  return (
    <div className="report-page">

      <section className="report-hero">
        <h1 className="report-title">Performance Selection</h1>
        <p className="report-subtitle">Choose your components before generating a report</p>
      </section>

      <section className="report-content">

        {/* CPU Comparison */}
        <div className="report-card">
          <div className="report-card-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>CPU Comparison</h2>
            {cpuList.length > 0 && (
              <button
                className="compare-btn"
                onClick={removeAllCPUs}
              >
                🗑 Remove All
              </button>
            )}
          </div>

          {cpuList.length === 0 ? (
            <p>No CPUs selected yet.</p>
          ) : (
            <div className="report-list">
              {cpuList.map(cpu => (
                <div key={cpu.id} className="report-item">

                  <div className="report-item-header">
                    <h3>{cpu.name}</h3>

                    <button
                      className="compare-btn selected"
                      onClick={() => removeCPU(cpu.id)}
                    >
                      ❌ Remove
                    </button>
                  </div>

                  <p>{cpu.cores} cores / {cpu.threads} threads</p>
                  <p>Boost: {cpu.boostClock}</p>
                  <p>TDP: {cpu.tdp} W</p>
                  <p className="report-scorecpu">Score: {cpu.normalizedScore}%</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GPU Comparison */}
        <div className="report-card">
          <div className="report-card-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>GPU Comparison</h2>
            {gpuList.length > 0 && (
              <button
                className="compare-btn"
                onClick={removeAllGPUs}
              >
                🗑 Remove All
              </button>
            )}
          </div>

          {gpuList.length === 0 ? (
            <p>No GPUs selected yet.</p>
          ) : (
            <div className="report-list">
              {gpuList.map(gpu => (
                <div key={gpu.id} className="report-item">

                  <div className="report-item-header">
                    <h3>{gpu.name}</h3>

                    <button
                      className="compare-btn selected"
                      onClick={() => removeGPU(gpu.id)}
                    >
                      ❌ Remove
                    </button>
                  </div>

                  <p>VRAM: {gpu.vram} GB</p>
                  <p>Boost: {gpu.boostClock}</p>
                  <p>TDP: {gpu.tdp} W</p>
                  <p className="report-scoregpu">Score: {gpu.normalizedScore}%</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link to comparison */}
        <div className="report-cardlast">
          <h2>Ready to Compare</h2>
          <p>Review your selected components on the comparison page.</p>

          <Link to="/compare" className="compare-nav-btn">
            Proceed to Comparison →
          </Link>
        </div>

      </section>

      {/* sample report */}
      <div className="report-card-final">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Current Sample Report</h2>

        </div>

        {cpuList.length === 0 && gpuList.length === 0 ? (
          <p>No components selected yet.</p>
        ) : (
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

            {/* CPU Summary */}
            {cpuList.length > 0 && (
              <div className="report-item">
                <h3>CPU Summary</h3>
                {cpuList.map(cpu => (
                  <p key={cpu.id}>
                    <strong>{cpu.name}</strong> — {cpu.cores}C/{cpu.threads}T, Boost {cpu.boostClock}, TDP {cpu.tdp}W, Score {cpu.normalizedScore}%
                  </p>
                ))}
              </div>
            )}

            {/* GPU Summary */}
            {gpuList.length > 0 && (
              <div className="report-item">
                <h3>GPU Summary</h3>
                {gpuList.map(gpu => (
                  <p key={gpu.id}>
                    <strong>{gpu.name}</strong> — {gpu.vram}GB VRAM, Boost {gpu.boostClock}, TDP {gpu.tdp}W, Score {gpu.normalizedScore}%
                  </p>
                ))}
              </div>
            )}

            {/* Combined System Summary */}
            {(cpuList.length > 0 || gpuList.length > 0) && (
              <div className="report-item">
                <h3>Overall System Summary</h3>
                <p>{cpuList.length > 0 && `• ${cpuList.length} CPU(s) selected`}</p>
                <p>{gpuList.length > 0 && `• ${gpuList.length} GPU(s) selected`}</p>
                <p>Scores are normalized within each category for fair comparison.</p>
              </div>
            )}
          </div>
          
        )}

      </div>

    </div>
  );
}
