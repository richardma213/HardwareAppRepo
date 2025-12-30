import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import './App.css';
import Navbar from "./components/Navbar";
import './components/Navbar.css';
import CPU from "./pages/CPU";
import GPU from "./pages/GPU";
import Report from "./pages/Report";
import Compare from "./pages/Compare";
import SettingsPopUp from "./components/SettingsPopUp.jsx";
import { lightTheme, darkTheme, applyTheme } from "./styles/theme";
import { CompareProvider } from "./components/CompareContext.jsx";
import { BaselineProvider } from "./components/BaselineContext.jsx";
import BaselineWindow from "./components/BaselineWindow.jsx";

// Core class
function App() {
  // Functions & Setting useStates

  const [showSettings, setShowSettings] = useState(false); // settings page display
  const [showBaselineWindow, setShowBaselineWindow] = useState(false); // baseline page display

  // Dark mode settings
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    applyTheme(darkMode ? darkTheme : lightTheme);
  }, [darkMode]);


  return (
    <CompareProvider>
      <BaselineProvider>
        <BrowserRouter>
          <div className={darkMode ? "dark" : "light"}>
            <Navbar setShowSettings={setShowSettings} />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cpu" element={<CPU />} />
              <Route path="/gpu" element={<GPU />} />
              <Route path="/report" element={<Report />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>

          <SettingsPopUp
            open={showSettings}
            onClose={() => setShowSettings(false)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setShowBaselineWindow={setShowBaselineWindow}
          />
                    
          <BaselineWindow
            open={showBaselineWindow}
            onClose={() => setShowBaselineWindow(false)}
          />

          </div>
        </BrowserRouter>
      </BaselineProvider>
    </CompareProvider>
  );
}

export default App;
