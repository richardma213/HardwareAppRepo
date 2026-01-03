import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import './App.css';
import Navbar from "./components/Navbar";
import './components/Navbar.css';
import CPU from "./pages/CPU";
import GPU from "./pages/GPU";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Report from "./pages/Report";
import Compare from "./pages/Compare";
import SettingsPopUp from "./components/SettingsPopUp.jsx";
import { lightTheme, darkTheme, applyTheme } from "./styles/theme";
import { CompareProvider } from "./components/CompareContext.jsx";
import { BaselineProvider } from "./components/BaselineContext.jsx";
import BaselineWindow from "./components/BaselineWindow.jsx";
import ProtectedRoute  from "./pages/ProtectedRoute.jsx";
import BenchReportInfo from "./components/BenchReportInfo.jsx";
import SavedReports from "./pages/SavedReports.jsx";
import SharedReport from "./pages/SharedReport.jsx";
import SharedReports from "./pages/SharedReports.jsx";

// Core class
function App() {
  // Functions & Setting useStates

  const [showSettings, setShowSettings] = useState(false); // settings page display
  const [showBaselineWindow, setShowBaselineWindow] = useState(false); // baseline page display
  const [showBenchReportInfo, setShowBenchReportInfo] = useState(false);

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
            <Navbar setShowSettings={setShowSettings} setShowBenchReportInfo={setShowBenchReportInfo} />
            
           <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shared/:id" element={<SharedReport />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cpu"
              element={
                <ProtectedRoute>
                  <CPU />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gpu"
              element={
                <ProtectedRoute>
                  <GPU />
                </ProtectedRoute>
              }
            />

            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />

            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              }
            />

            <Route
              path="/saved-reports"
              element={
                <ProtectedRoute>
                  <SavedReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shared-reports"
              element={
                <ProtectedRoute>
                  <SharedReports />
                </ProtectedRoute>
              }
            />


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

          <BenchReportInfo 
            open={showBenchReportInfo}
            onClose={() => setShowBenchReportInfo(false)}
          />

          </div>
        </BrowserRouter>
      </BaselineProvider>
    </CompareProvider>
  );
}

export default App;
