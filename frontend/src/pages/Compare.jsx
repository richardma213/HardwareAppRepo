import "./Compare.css";
import { useCompare } from "../components/CompareContext";
import { useState } from "react";
import { calculateScore as calculateCPUScore, normalizeCpuMetrics } from "../data/cpuscoreinfo";
import { calculateGpuScore, normalizeGpuMetrics} from "../data/gpuscoreinfo";
import { useBaseline } from "../components/BaselineContext";


export default function Compare() {
  const { cpuList, gpuList, removeCPU, removeGPU } = useCompare();

  const [weights, setWeights] = useState({
    clockSpeed: 0.4,   
    cores: 0.3,        
    threads: 0.2,      
    efficiency: 0.1,   

    clock: 0.4,       
    vram: 0.4,        
    efficiencyGPU: 0.2 
  });

  const { baselineCPU, baselineGPU } = useBaseline();

  const updateWeight = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: Number(value) }));
  };

  // Function to normalize cpu weights to 1
  function normalizeCPUWeights(w) {
    const total =
      w.clockSpeed +
      w.cores +
      w.threads +
      w.efficiency;

    if (total === 0) {
      return {
        clockSpeed: 0.25,
        cores: 0.25,
        threads: 0.25,
        efficiency: 0.25
      };
    }

    return {
      clockSpeed: w.clockSpeed / total,
      cores: w.cores / total,
      threads: w.threads / total,
      efficiency: w.efficiency / total
    };
  }

  const normalizedCPUWeights = normalizeCPUWeights(weights);

  // Function to normalize gpu weights to 1
  function normalizeGPUWeights(w) {
    const total =
      w.clock +
      w.vram +
      w.efficiencyGPU;

    if (total === 0) {
      return {
        clock: 0.33,
        vram: 0.33,
        efficiency: 0.33
      };
    }

    return {
      clock: w.clock / total,
      vram: w.vram / total,
      efficiency: w.efficiencyGPU / total
    };
  }

  const normalizedGPUWeights = normalizeGPUWeights(weights);

  // 1. weighted scoring
  const scoredCPUs = cpuList.map(cpu => ({
    ...cpu,
    ...calculateCPUScore(cpu, normalizedCPUWeights, baselineCPU)
  }));

  // 2. normalize weighted total
  const maxCPU = Math.max(...scoredCPUs.map(c => c.total), 1);

  const weightedNormalized = scoredCPUs.map(cpu => ({
    ...cpu,
    normalizedScore: Math.round((cpu.total / maxCPU) * 100)
  }));

  // 3. normalize raw metrics (from cpuscoreinfo.js)
  const detailedCPUs = normalizeCpuMetrics(weightedNormalized);


  // 1. weighted GPU score breakdown
  const scoredGPUs = gpuList.map(gpu => ({
    ...gpu,
    ...calculateGpuScore(gpu, normalizedGPUWeights, baselineGPU)
  }));

  // 2. normalize final weighted score
  const maxGPU = Math.max(...scoredGPUs.map(g => g.total), 1);

  const normalizedGPUs = scoredGPUs.map(gpu => ({
    ...gpu,
    normalizedScore: Math.round((gpu.total / maxGPU) * 100)
  }));

  // 3. normalize raw metrics
  const detailedGPUs = normalizeGpuMetrics(normalizedGPUs);

  
  return (
    <div className="compare-page">

        {/* LEFT SIDE — SLIDERS */}
        <aside className="compare-sidebar">
        <h2>Custom Comparison</h2>
        <p>Adjust the importance of each metric.</p>

        <div className="slider-group">
            {/* CPU sliders */}
            <h3>CPU Weights</h3>

            {/* Clock speed */}
            <div className="slider-row">
            <label>Clock Speed</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.clockSpeed}
                onChange={(e) => updateWeight("clockSpeed", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.clockSpeed}
                onChange={(e) => updateWeight("clockSpeed", e.target.value)}
                />
            </div>
            </div>

            {/* Cores */}
            <div className="slider-row">
            <label>Cores</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.cores}
                onChange={(e) => updateWeight("cores", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.cores}
                onChange={(e) => updateWeight("cores", e.target.value)}
                />
            </div>
            </div>

            {/* Threads */}
            <div className="slider-row">
            <label>Threads</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.threads}
                onChange={(e) => updateWeight("threads", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.threads}
                onChange={(e) => updateWeight("threads", e.target.value)}
                />
            </div>
            </div>

            {/* CPU efficiency */}
            <div className="slider-row">
            <label>Efficiency (TDP)</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.efficiency}
                onChange={(e) => updateWeight("efficiency", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.efficiency}
                onChange={(e) => updateWeight("efficiency", e.target.value)}
                />
            </div>
            </div>

            {/* GPU sliders */}
            <h3 style={{ marginTop: "1rem" }}>GPU Weights</h3>

            {/* GPU clock */}
            <div className="slider-row">
            <label>Clock Speed</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.clock}
                onChange={(e) => updateWeight("clock", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.clock}
                onChange={(e) => updateWeight("clock", e.target.value)}
                />
            </div>
            </div>

            {/* VRAM */}
            <div className="slider-row">
            <label>VRAM</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.vram}
                onChange={(e) => updateWeight("vram", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.vram}
                onChange={(e) => updateWeight("vram", e.target.value)}
                />
            </div>
            </div>

            {/* GPU efficiency */}
            <div className="slider-row">
            <label>Efficiency (TDP)</label>
            <div className="slider-with-input">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.efficiencyGPU}
                onChange={(e) => updateWeight("efficiencyGPU", e.target.value)}
                />
                <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={weights.efficiencyGPU}
                onChange={(e) => updateWeight("efficiencyGPU", e.target.value)}
                />
            </div>
            </div>
        </div>
        </aside>


      {/* RIGHT SIDE — RESULTS */}
      <main className="compare-results">

        {/* CPU SECTION */}
        <section className="compare-section">
          <h2>CPU Comparison</h2>

          {detailedCPUs.length === 0 ? (
      <p>No CPUs selected.</p>
    ) : (
       <div className="compare-grid">
        {detailedCPUs.map(cpu => (
          <div key={cpu.id} className="compare-card">

            <div className="compare-card-header">
              <h3>{cpu.name}</h3>
              <button
                className="compare-remove-btn"
                onClick={() => removeCPU(cpu.id)}
              >
                ✕
              </button>
            </div>

            <p>
            {cpu.cores} cores ({(cpu.coreScore*100).toFixed(0)}%) /
            {cpu.threads} threads ({(cpu.threadScore*100).toFixed(0)}%)
            </p>

            <p>
              Boost: {cpu.boostClock} ({(cpu.clockScore*100).toFixed(0)}%)
            </p>

            <p>
              TDP: {cpu.tdp} W ({(cpu.efficiencyScore*100).toFixed(0)}%)
            </p>

            <p className="compare-score-cpu">
              Score: {cpu.normalizedScore}
            </p>


          </div>
        ))}
      </div>


        )}

      </section>

        {/* GPU SECTION */}
        <section className="compare-section">
          <h2>GPU Comparison</h2>

          {normalizedGPUs.length === 0 ? (
            <p>No GPUs selected.</p>
          ) : (
            <div className="compare-grid">
              {detailedGPUs.map(gpu => (
                <div key={gpu.id} className="compare-card">
                  <div className="compare-card-header">
                    <h3>{gpu.name}</h3>
                    <button className="compare-remove-btn"
                      onClick={() => removeGPU(gpu.id)}
                    >
                      ✕
                    </button>
                  </div>

                  <p>
                VRAM: {gpu.vram} GB ({(gpu.vramScore * 100).toFixed(0)}%) 
                </p>

                <p>
                  Boost: {gpu.boostClock} ({(gpu.clockScore*100).toFixed(0)}%)
                </p>

                <p>
                  TDP: {gpu.tdp} W ({(gpu.efficiencyScore * 100).toFixed()}%) 
                </p>

                <p className="compare-score-gpu">
                  Score: {gpu.normalizedScore}
                </p>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* FINAL GENERATED REPORT */}
        <section className="compare-section">
          <div className="report-card-final">
            <div className="report-header">
              <h2>Final Generated Report</h2>
            </div>

            {detailedCPUs.length === 0 && detailedGPUs.length === 0 ? (
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

                {/* CPU SUMMARY */}
                {detailedCPUs.length > 0 && (
                  <div className="report-item">
                    <h3>CPU Summary</h3>
                    {detailedCPUs.map(cpu => (
                      <p key={cpu.id}>
                        <strong>{cpu.name}</strong> — {cpu.cores}C/{cpu.threads}T, 
                        Boost {cpu.boostClock}, TDP {cpu.tdp}W, 
                        Score {cpu.normalizedScore}%
                      </p>
                    ))}
                  </div>
                )}

                {/* GPU SUMMARY */}
                {detailedGPUs.length > 0 && (
                  <div className="report-item">
                    <h3>GPU Summary</h3>
                    {detailedGPUs.map(gpu => (
                      <p key={gpu.id}>
                        <strong>{gpu.name}</strong> — {gpu.vram}GB VRAM, 
                        Boost {gpu.boostClock}, TDP {gpu.tdp}W, 
                        Score {gpu.normalizedScore}%
                      </p>
                    ))}
                  </div>
                )}

                {/* OVERALL SUMMARY */}
                {(detailedCPUs.length > 0 || detailedGPUs.length > 0) && (
                  <div className="report-item">
                    <h3>Overall System Summary</h3>
                    <p>{detailedCPUs.length > 0 && `• ${detailedCPUs.length} CPU(s) selected`}</p>
                    <p>{detailedGPUs.length > 0 && `• ${detailedGPUs.length} GPU(s) selected`}</p>
                    <p>Scores are normalized within each category for fair comparison.</p>
                  </div>
                )}

              </div>
            )}
          </div>
        </section>


      </main>
    </div>

    
  );
}
