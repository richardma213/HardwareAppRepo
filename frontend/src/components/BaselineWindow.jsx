import { useState, useRef } from "react";
import { useBaseline } from "./BaselineContext";
import "./BaselineWindow.css";

export default function BaselineWindow({ open, onClose }) {
  const { baselineCPU, setBaselineCPU, baselineGPU, setBaselineGPU } = useBaseline();

  const [minimized, setMinimized] = useState(false);

  // Dragging state
  const windowRef = useRef(null);
  const pos = useRef({ x: 120, y: 120, offsetX: 0, offsetY: 0, dragging: false });

  if (!open) return null;

  const safe = (value) => {
    if (value === "") return "";
    return Math.max(0, Number(value));
  };

  // Start dragging
  const startDrag = (e) => {
    pos.current.dragging = true;
    pos.current.offsetX = e.clientX - pos.current.x;
    pos.current.offsetY = e.clientY - pos.current.y;
  };

  // Dragging movement
  const onDrag = (e) => {
    if (!pos.current.dragging) return;

    pos.current.x = e.clientX - pos.current.offsetX;
    pos.current.y = e.clientY - pos.current.offsetY;

    windowRef.current.style.left = pos.current.x + "px";
    windowRef.current.style.top = pos.current.y + "px";
  };

  // Stop dragging
  const stopDrag = () => {
    pos.current.dragging = false;
  };

  return (
    <div
      ref={windowRef}
      className={`baseline-window ${minimized ? "minimized" : ""}`}
      style={{ left: pos.current.x, top: pos.current.y }}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* HEADER */}
      <div className="baseline-header" onMouseDown={startDrag}>
        <span>Baseline Settings</span>

        <div className="baseline-controls">
          <button onClick={() => setMinimized(!minimized)}>
            {minimized ? "▢" : "—"}
          </button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* CONTENT */}
      {!minimized && (
        <div className="baseline-content">
          <h3>CPU Baseline</h3>

          <label>Clock Speed (GHz)</label>
          <input
            type="number"
            value={baselineCPU.clockSpeed}
            onChange={(e) =>
              setBaselineCPU({ ...baselineCPU, clockSpeed: safe(e.target.value) })
            }
          />

          <label>Cores</label>
          <input
            type="number"
            value={baselineCPU.cores}
            onChange={(e) =>
              setBaselineCPU({ ...baselineCPU, cores: safe(e.target.value) })
            }
          />

          <label>Threads</label>
          <input
            type="number"
            value={baselineCPU.threads}
            onChange={(e) =>
              setBaselineCPU({ ...baselineCPU, threads: safe(e.target.value) })
            }
          />

          <label>TDP (W)</label>
          <input
            type="number"
            value={baselineCPU.tdp}
            onChange={(e) =>
              setBaselineCPU({ ...baselineCPU, tdp: safe(e.target.value) })
            }
          />

          <h3>GPU Baseline</h3>

          <label>Boost Clock (MHz)</label>
          <input
            type="number"
            value={baselineGPU.boostClock}
            onChange={(e) =>
              setBaselineGPU({ ...baselineGPU, boostClock: safe(e.target.value) })
            }
          />

          <label>VRAM (GB)</label>
          <input
            type="number"
            value={baselineGPU.vram}
            onChange={(e) =>
              setBaselineGPU({ ...baselineGPU, vram: safe(e.target.value) })
            }
          />

          <label>TDP (W)</label>
          <input
            type="number"
            value={baselineGPU.tdp}
            onChange={(e) =>
              setBaselineGPU({ ...baselineGPU, tdp: safe(e.target.value) })
            }
          />
        </div>
      )}
    </div>
  );
}
