import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import './App.css';
import Navbar from "./components/Navbar";
import './components/Navbar.css';
import CPU from "./pages/CPU";
import GPU from "./pages/GPU";
import Report from "./pages/Report";
import SettingsPopUp from "./components/SettingsPopUp.jsx";
import { lightTheme, darkTheme, applyTheme } from "./styles/theme";


function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(updateTheme, [darkMode]);

  // Update theme based on current selection
  function updateTheme(){
    applyTheme(darkMode ? darkTheme: lightTheme);
  }

  // Handle close for settings screen
  function handleClose(){
    setShowSettings(false);
  }

  return (
    <BrowserRouter>
      <div className={darkMode ? "dark" : "light"}>
        <Navbar setShowSettings={setShowSettings} />

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/cpu" element={<CPU/>} />
          <Route path="/gpu" element={<GPU/>} />
          <Route path="/report" element={<Report/>} />

        </Routes>

        <SettingsPopUp
          open={showSettings}
          onClose={handleClose}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

      </div>
    </BrowserRouter>
  );
}


export default App;
