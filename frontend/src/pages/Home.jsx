import {Link} from "react-router-dom";
import "./Home.css";
import '../App.css';
// Home Page
export default function Home(){

  return (
  <div className="home-wrapper">

    {/* Title background label section */}
    <section className="hero-section">
      <h1 className="title">BenchReport 🖥️</h1>
      <p className="subtitle">Compare CPUs, GPUs, and generate performance insights instantly</p>

    </section>

    {/* Bottom section with link icons */}
    <section className="content-section">
      <div className="icon-grid">
        <Link to="/cpu" className="icon-card">🧠<span>CPU</span></Link>
        <Link to="/gpu" className="icon-card">🎮<span>GPU</span></Link>
        <Link to="/report" className="icon-card">📊<span>Report</span></Link>
        <Link to="/compare" className="icon-card">⚖️<span>Compare</span></Link>
      </div>
    </section>

  </div>
);

}