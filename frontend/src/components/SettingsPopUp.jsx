import "./SettingsPopUp.css";
import {jwtDecode} from "jwt-decode";
import ConfirmationPopup from "./ConfirmationPopup.jsx";
import { useState } from "react";

export default function SettingsPopup({
    open,
    onClose,
    darkMode,
    setDarkMode,
    setShowBaselineWindow
  }) {

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  const[showConfirmLogout, setshowConfirmLogout] = useState(false);
  

  if (!open) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <button className="settings-close" onClick={onClose}>✕</button>

        <h2>Settings</h2>
        {user && (
          <div className="settings-item">
            <label>Signed in as:</label>
            <span>{user.email}</span>
          </div>
        )}

        {!user && localStorage.getItem("guest") && (
          <div className="settings-item">
            <label>Signed in as:</label>
            <span>Guest</span>
          </div>
        )}
       
        
        <div className="settings-item">
          <label>Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

       {(user || localStorage.getItem("guest")) && (
       <div className="settings-item">
        <label>Baseline Settings</label>
        <input
          type="checkbox"
          checked={false} 
          onChange={() => setShowBaselineWindow(true)}
        />
      </div>
       )}

       <div className="settings-item button-group">

       {(user || localStorage.getItem("guest")) && (
          <div className="settings-item">
            <button className="saved-rep-button nav-link"
        
              onClick={() => {
                onClose();
                window.location.href = "/saved-reports";
              }}
            >
              <strong> View Saved Reports </strong>
            </button>
          </div>
        )}

        {(user || localStorage.getItem("guest")) && (
          <div className="settings-item">
            <button
              className="saved-rep-button nav-link"
              onClick={() => {
                onClose();
                window.location.href = "/shared-reports";
              }}
            >
              <strong> View Shared Reports </strong>
            </button>
          </div>
        )}
      </div>


      {(user || localStorage.getItem("guest")) && ( 
      <button
          className="nav-link logout-button"
          onClick={() => { setshowConfirmLogout(true)}}
       >
          Logout
          </button>
      )}

      </div>

      {showConfirmLogout && (
        <ConfirmationPopup
          message="Are you sure you want to log out? Any
          unsaved data will be discarded."
          onConfirm={() => {
            // Clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("guest");
            localStorage.removeItem("weights");
            localStorage.removeItem("cpuList");
            localStorage.removeItem("gpuList");

            // Close settings
            onClose();

            // Redirect
            window.location.href = "/login";
          }}
          onCancel={() => setshowConfirmLogout(false)}
        />
      )}

    </div>
  );
}
