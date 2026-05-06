import { Link } from "react-router-dom"
import logo from "./Image/University logo.png"

function Navbar() {
  return (
    <nav className="navbar">

      {/* background overlay for styling */}
      <div className="nav-overlay"></div>

      <div className="nav-content">

        {/* university logo */}
        <img
          src={logo}
          alt="University Logo"
          className="nav-logo"
        />

        {/* navigation links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/modes">Modes</Link>
          <Link to="/estimator">Estimator</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/live">Live</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar