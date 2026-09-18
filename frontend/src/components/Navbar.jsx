import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ setShowSettings, setShowBenchReportInfo }) {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  const hasAccess = Boolean(localStorage.getItem("token") || localStorage.getItem("guest"));
  const isGuest = Boolean(localStorage.getItem("guest"));
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const pageLinks = [
    { to: "/", label: "Home" },
    { to: "/cpu", label: "CPU" },
    { to: "/gpu", label: "GPU" },
    { to: "/report", label: "Report" },
    { to: "/compare", label: "Compare" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  // Close the dropdown on an outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the dropdown whenever the route changes (a link was followed)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`navbar ${isAuthRoute ? "auth-nav" : ""}`}>
      <div className="nav-left">
        <Link to="/" className="logo">BenchReport 🖥️</Link>

        <div>
          <button className="br-info-button"
            onClick={() => setShowBenchReportInfo(true)}>
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

        {(isLoggedIn || hasAccess) && (
          <div className="nav-dropdown" ref={menuRef}>
            <button
              className="nav-dropdown-toggle"
              onClick={() => setMenuOpen(open => !open)}
            >
              Pages {menuOpen ? "▲" : "▼"}
            </button>

            {menuOpen && (
              <div className="nav-dropdown-menu">
                {pageLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`nav-dropdown-item ${pathname === link.to ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          ⚙️ Settings
        </button>

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
