import {Link} from 'react-router-dom';
import './Navbar.css';
export default function Navbar({ setShowSettings }) {

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">BenchReport 🖥️</Link>
      </div>

      <div className="nav-right">

        <button 
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          ⚙️ Settings
        </button>

        <Link to="/cpu" className="nav-link">CPU</Link>
        <Link to="/gpu" className="nav-link">GPU</Link>
        <Link to="/report" className="nav-link">Report</Link>
        <Link to="/compare" className="nav-link"> Compare </Link>
        <Link to="/" className="nav-link">Home</Link>

      </div>
    </nav>
  );
}
