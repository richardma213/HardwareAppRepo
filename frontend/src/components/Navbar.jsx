import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ setShowSettings, setShowBenchReportInfo }) {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  
  const hasAccess = Boolean(localStorage.getItem("token") || localStorage.getItem("guest"));
  const isGuest = Boolean(localStorage.getItem("guest"));
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (

    
    <nav className={`navbar ${isAuthRoute ? "auth-nav" : ""}`}>
      <div className="nav-left">
        <Link to="/" className="logo">BenchReport 🖥️</Link>
          <div >
            <button className= "br-info-button"
              onClick={() => setShowBenchReportInfo(true)} >
              <strong>ℹ️ Info  </strong> 
            </button>
          </div>
      </div>

    

      {isGuest && (
        <div className="guest-banner">
          You’re currently browsing in Guest Mode — your data won’t be saved.  <Link to="/login" className="guest-banner-link">
            Log in
          </Link>
        </div>
      )}

      <div className="nav-right">
        <button
              className="settings-button"
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Settings
        </button>

        {(isLoggedIn || hasAccess) && (
          <>

            <Link to="/cpu" className="nav-link">CPU</Link>
            <Link to="/gpu" className="nav-link">GPU</Link>
            <Link to="/report" className="nav-link">Report</Link>
            <Link to="/compare" className="nav-link">Compare</Link>
            <Link to="/" className="nav-link">Home</Link>

          </>
        )}

        {(!hasAccess) && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
