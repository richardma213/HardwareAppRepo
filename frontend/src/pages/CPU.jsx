import "./CPU.css";
import { useState } from "react";
import { cpuData } from "../data/cpus";
import { calculateScore } from "../data/cpuscoreinfo";
import WeightRadarChart from "../components/WeightRadarChart";
import Card from "../components/Card";
import InfoPopup from "../components/InfoPopUp";
import { useCompare } from "../components/CompareContext"; 
import { useBaseline } from "../components/BaselineContext";

export default function CPU() {

  const [Search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [showInfo, setShowInfo] = useState(false);
  const { cpuList, addCPU, removeCPU } = useCompare();

  
  const { baselineCPU } = useBaseline();

  const [weights, setWeights] = useState({
    clockSpeed: 0.4,
    cores: 0.3,
    threads: 0.2,
    efficiency: 0.1
  });


  function getFinalScore(cpu){
    return calculateScore(cpu, normalized, baselineCPU).total;
  }


  const normalized = normalizeWeights(weights);

  // score cpus using normalized weights
  const scoredCPUs = cpuData.map(cpu => ({...cpu, finalScore: getFinalScore(cpu)}));

  // normalize finalScore to 0–100
  const maxScore = Math.max(...scoredCPUs.map(cpu => cpu.finalScore));

  const normalizedCPUs = scoredCPUs.map(cpu => ({...cpu, normalizedScore: Math.round((cpu.finalScore / maxScore) * 100)}));

  // sort using normalizedScore
  const sortedCPUs = sortCPUs(normalizedCPUs, sortBy);

  // filter after sorting
  const filteredCPUs = sortedCPUs.filter(cpu =>
    cpu.name.toLowerCase().includes(Search.toLowerCase())
  );

    function normalizeWeights(w) {
      const total = w.clockSpeed + w.cores + w.threads + w.efficiency;

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

  // Sort the list given user search selection
  function sortCPUs(cpus, sortBy) {
    const sorted = [...cpus];

    switch (sortBy) {
      case "cores":
        return sorted.sort((a, b) => b.cores - a.cores);
      case "threads":
        return sorted.sort((a, b) => b.threads - a.threads);
      case "tdp":
        return sorted.sort((a, b) => a.tdp - b.tdp); 
      case "score":
        return sorted.sort((a, b) => b.finalScore - a.finalScore);
      case "cores1":
         return sorted.sort((a, b) => a.cores - b.cores);
      case "threads1":
        return sorted.sort((a, b) => a.threads - b.threads);
      case "tdp1":
        return sorted.sort((a, b) => b.tdp - a.tdp); 
      case "score1":
        return sorted.sort((a, b) => a.finalScore - b.finalScore); 
      default:
        return sorted.sort((a, b) => b.finalScore - a.finalScore);
    }
  }
  

  return (
    <div className="cpu-page">

      <section className="cpu-hero">
        <h1 className="cpu-title">CPU Selector</h1>

        <p className="cpu-subtitle">
          Browse CPUs and add them to your comparison list →
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

      <section className="cpu-content">

        {/* left column */}
        <div className="cpu-left">

          <div className="weight-controls">

            <Card className="jchart-overlay-card">
              <h2 style={{ color: "#fff", marginBottom: "10px" }}>
                Weight Distribution
              </h2>

              <WeightRadarChart weights={normalized} />
            </Card>

            <Card className="jchart-overlay-card">
              <div className="cpu-weight-grid">

                {/* clock speed */}
                <label className="weight-control">
                  <span>Clock Speed Weight</span>

                  <div className="weight-input-row">
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.clockSpeed}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          clockSpeed: parseFloat(e.target.value)
                        })
                      }
                      className="weight-number"
                    />

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.clockSpeed}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          clockSpeed: parseFloat(e.target.value)
                        })
                      }
                      className="weight-slider"
                    />
                  </div>
                </label>

                {/* cores */}
                <label className="weight-control">
                  <span>Cores Weight</span>

                  <div className="weight-input-row">
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.cores}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          cores: parseFloat(e.target.value)
                        })
                      }
                      className="weight-number"
                    />

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.cores}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          cores: parseFloat(e.target.value)
                        })
                      }
                      className="weight-slider"
                    />
                  </div>
                </label>

                {/* threads */}
                <label className="weight-control">
                  <span>Threads Weight</span>

                  <div className="weight-input-row">
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.threads}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          threads: parseFloat(e.target.value)
                        })
                      }
                      className="weight-number"
                    />

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.threads}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          threads: parseFloat(e.target.value)
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

                <p>Normalized Weights:</p>
                <ul>
                  <li>Clock Speed: {normalized.clockSpeed.toFixed(2)}</li>
                  <li>Cores: {normalized.cores.toFixed(2)}</li>
                  <li>Threads: {normalized.threads.toFixed(2)}</li>
                  <li>Efficiency: {normalized.efficiency.toFixed(2)}</li>
                </ul>

              </div>
            </Card>

          </div>

        </div>

        {/* right column */}
        <div className="cpu-right">

          {/* sticky search + sort bar */}
          <div className="cpu-right-header">
            <input
              type="text"
              className="cpu-search"
              placeholder="Search for a CPU..."
              value={Search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cpu-sort"
            >
              <option value="score">Score (High → Low)</option>
              <option value="score1">Score (Low → High)</option>

              <option value="cores">Cores (High → Low)</option>
              <option value="cores1">Cores (Low → High)</option>

              <option value="threads">Threads (High → Low)</option>
              <option value="threads1">Threads (Low → High)</option>

              <option value="tdp">TDP (Low → High)</option>
              <option value="tdp1">TDP (High → Low)</option>
            </select>
          </div>

         
          {/* scrollable cpu list */}
          <div className="cpu-list">
            {filteredCPUs.length > 0 ? (
              filteredCPUs.map((cpu) => {
                const isSelected = cpuList.some((c) => c.id === cpu.id);

                return (
                  <div key={cpu.id} className="cpu-card">

                    {/* Title row with compare button */}
                    <div className="cpu-card-header">
                      <h3>{cpu.name}</h3>

                      <button
                        className={`compare-btn ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          isSelected ? removeCPU(cpu.id) : addCPU(cpu)
                        }
                      >
                        {isSelected ? (
                          <>
                            ✓ Added
                          </>
                        ) : (
                          "Compare"
                        )}
                      </button>
                    </div>

                    <p>{cpu.cores} cores / {cpu.threads} threads</p>
                    <p>Boost: {cpu.boostClock}</p>
                    <p>TDP: {cpu.tdp}</p>
                    <p className="cpu-score">Score: {cpu.normalizedScore}%</p>
                  </div>
                );
              })
            ) : (
              <p>No CPUs found.</p>
            )}
          </div>

        </div>

      </section>

    </div>

  );

}