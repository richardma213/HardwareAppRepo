import "./InfoPopUp.css";

export default function InfoPopup({ open, onClose }) {
  if (!open) return null;

  return (
  
    <div className="info-overlay">
      <div className="info-modal">
        <button className="info-close" onClick={onClose}>✕</button>

        <h2>How Weighting Works</h2>
        <p>
          These weights let you customize how different GPU or CPU attributes
          contribute to the final performance score.
        </p>

        <div className="info-section">
          <h3>Clock Speed</h3>
          <p>
            Higher clock speeds generally mean faster processing. Increasing this
            weight makes raw frequency more important in the score.
          </p>
        </div>

        <div className="info-section">
          <h3>VRAM</h3>
          <p>
            VRAM affects how well the GPU handles textures, large scenes, and
            high‑resolution workloads. A higher weight prioritizes memory capacity.
          </p>
        </div>

        <div className="info-section">
          <h3>Cores / Threads</h3>
          <p>
            More cores or threads improve parallel workloads. Increasing this
            weight boosts multi‑threaded performance importance.
          </p>
        </div>

        <div className="info-section">
          <h3>Efficiency</h3>
          <p>
            Efficiency compares performance to power usage (TDP - Thermal Design Power). A higher weight
            rewards GPUs/CPUs that deliver more performance per watt.
          </p>
        </div>

      </div>

      
    </div>
  );
}
