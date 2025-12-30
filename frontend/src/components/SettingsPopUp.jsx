import "./SettingsPopUp.css";

export default function SettingsPopup({
    open,
    onClose,
    darkMode,
    setDarkMode,
    setShowBaselineWindow
  }) {

  if (!open) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <button className="settings-close" onClick={onClose}>✕</button>

        <h2>Settings</h2>

        <div className="settings-item">
          <label>Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

       <div className="settings-item">
        <label>Baseline Settings</label>
        <input
          type="checkbox"
          checked={false} 
          onChange={() => setShowBaselineWindow(true)}
        />
      </div>


      </div>
    </div>
  );
}
