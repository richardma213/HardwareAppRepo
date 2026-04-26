import "./GPU.css";
import { useState } from "react";
import { gpuData } from "../data/gpus";
import { calculateGpuScore } from "../data/gpuscoreinfo";
import GpuWeightRadarChart from "../components/GpuWeightRadarChart"
import Card from "../components/Card";
import InfoPopup from "../components/InfoPopUp";
import { useCompare } from "../components/CompareContext";
import { useBaseline } from "../components/BaselineContext";

export default function GPU() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [showInfo, setShowInfo] = useState(false);
  const { gpuList, addGPU, removeGPU } = useCompare();

  const { baselineGPU } = useBaseline();
   
  const [weights, setWeights] = useState({
    clock: 0.5,
    vram: 0.3,
    efficiency: 0.2
  });

  // normalize weights to 1
  function normalizeWeights(w) {
    const total = w.clock + w.vram + w.efficiency;

    // default weights
    if (total === 0) {
      return { clock: 0.34, vram: 0.33, efficiency: 0.33 };
    }

    // calculate weights
    return {
      clock: w.clock / total,
      vram: w.vram / total,
      efficiency: w.efficiency / total
    };
  }

  // function to sort the gpu list based on search 
  function sortGPUs(gpus, sortBy) {
    const sorted = Array.from(gpus);
    
    switch (sortBy) {
      case "vram":
        return sorted.sort((a, b) => b.vram - a.vram);
      case "tdp":
        return sorted.sort((a, b) => a.tdp - b.tdp); 
      case "score":
        return sorted.sort((a, b) => b.normalizedScore - a.normalizedScore);
      case "score1":
        return sorted.sort((a, b) => a.normalizedScore - b.normalizedScore);
      case "vram1":
         return sorted.sort((a, b) => a.vram - b.vram);
      case "tdp1":
        return sorted.sort((a, b) => b.tdp - a.tdp);
      default:
        return sorted.sort((a, b) => b.normalizedScore - a.normalizedScore);
    }
  }

  // Calculate and append the final score to the gpu
  function addScore(gpu){
    return {
      ...gpu, finalScore: calculateGpuScore(gpu, normalizedWeights, baselineGPU).total
    }
  }

  // Helper method that returns the final score of a gpu
  function getFinalScore(gpu){
    return gpu.finalScore;
  }

  // normalize weights to 1
  const normalizedWeights = normalizeWeights(weights);

  const scoredGPUs = gpuData.map(addScore); // score each gpu in the list

  const maxScore = Math.max(...scoredGPUs.map(getFinalScore)); // get max in the scored gpu list

  // Normalize the scores
  const normalizedGPUs = scoredGPUs.map(gpu => ({
    ...gpu,
    normalizedScore: maxScore > 0 ? Math.round((gpu.finalScore / maxScore) * 100) : 0
  })); 

  // Sort scores
  const sortedGPUs = sortGPUs(normalizedGPUs, sortBy);

  // Search bar name filtering 
  const filteredGPUs = sortedGPUs.filter(gpu => {
    const name = gpu.name.toLowerCase();
    const terms = search.toLowerCase().split(" ").filter(Boolean);

    return terms.every(term => name.includes(term));
  });


  return (

    <div className="gpu-page">

    {/* title section */}
    <section className="gpu-hero">
      <h1 className="gpu-title">GPU Selector</h1>

      <p className="gpu-subtitle">
        Browse GPUs and see relative performance scores →
        <button
          className="info-button"
          onClick={() => setShowInfo(true)}
        >
          ℹ️ Info
        </button>

        <InfoPopup
          open={showInfo}
          onClose={() => setShowInfo(false)}
        />
      </p>
    </section>

    {/* two column content */}
    <section className="gpu-content">

      {/* left column */}
      <div className="gpu-left">

        <Card className="jchart-overlay-card">
          <h2 style={{ color: "#fff", marginBottom: "10px" }}>
            Weight Distribution
          </h2>

          <GpuWeightRadarChart weights={normalizedWeights} />
        </Card>

        <div className="gpu-weights">
          <Card className="jchart-overlay-card">
            <div className="gpu-weight-grid">

              {/* clock */}
              <label className="weight-control">
                <span>Clock Weight</span>

                <div className="weight-input-row">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights.clock}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        clock: parseFloat(e.target.value)
                      })
                    }
                    className="weight-number"
                  />

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights.clock}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        clock: parseFloat(e.target.value)
                      })
                    }
                    className="weight-slider"
                  />
                </div>
              </label>

              {/* vram */}
              <label className="weight-control">
                <span>VRAM Weight</span>

                <div className="weight-input-row">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights.vram}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        vram: parseFloat(e.target.value)
                      })
                    }
                    className="weight-number"
                  />

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights.vram}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        vram: parseFloat(e.target.value)
                      })
                    }
                    className="weight-slider"
                  />
                </div>
              </label>

              {/* efficiency */}
              <label className="weight-control">
                <span>Efficiency Weight</span>

                <div className="weight-input-row">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights.efficiency}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        efficiency: parseFloat(e.target.value)
                      })
                    }
                    className="weight-number"
                  />

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights.efficiency}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        efficiency: parseFloat(e.target.value)
                      })
                    }
                    className="weight-slider"
                  />
                </div>
              </label>

            </div>

            {/* normalized weights */}
            <p style={{ marginTop: "15px", color: "white" }}>
              Normalized Weights:
            </p>

            <ul style={{ color: "white" }}>
              <li>Clock: {normalizedWeights.clock.toFixed(2)}</li>
              <li>VRAM: {normalizedWeights.vram.toFixed(2)}</li>
              <li>Efficiency: {normalizedWeights.efficiency.toFixed(2)}</li>
            </ul>
          </Card>
        </div>

      </div>

      {/* right column */}
      <div className="gpu-right">

        {/* sticky search + sort bar */}
        <div className="gpu-right-header">
          <input
            type="text"
            className="gpu-search"
            placeholder="Search for a GPU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="gpu-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="score">Score (High → Low)</option>
            <option value="score1">Score (Low → High)</option>

            <option value="vram">VRAM (High → Low)</option>
            <option value="vram1">VRAM (Low → High)</option>

            <option value="tdp">TDP (Low → High)</option>
            <option value="tdp1">TDP (High → Low)</option>
          </select>
        </div>

       {/* scrollable gpu list */}
        <div className="gpu-list">
          {filteredGPUs.length > 0 ? (
           filteredGPUs.map((gpu) => {
            const isSelected = gpuList.some((g) => g.id === gpu.id);

            return (
              <div key={gpu.id} className="gpu-card">

                {/* Title row with compare button */}
                <div className="gpu-card-header">
                  <h3>{gpu.name}</h3>

                  <button
                    className={`compare-btn ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      isSelected ? removeGPU(gpu.id) : addGPU(gpu)
                    }
                  >
                    {isSelected ? "✓ Added" : "Compare"}
                  </button>
                </div>

                <p>VRAM: {gpu.vram} GB</p>
                <p>Boost: {gpu.boostClock}</p>
                <p>TDP: {gpu.tdp} W</p>
                <p className="gpu-score">Score: {gpu.normalizedScore}%</p>
              </div>
            );
          })
 
         ) : (
              <p>No GPUs found.</p>
        )}
        </div>


      </div>

    </section>

  </div>



  );
}
