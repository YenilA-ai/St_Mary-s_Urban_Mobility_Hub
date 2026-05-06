import { Routes, Route } from "react-router-dom"

// import all pages
import Navbar from "./Navbar"
import Home from "./Home"
import Modes from "./Modes"
import Estimator from "./Estimator"
import Compare from "./Compare"
import Dashboard from "./Dashboard"
import LiveTransport from "./LiveTransport"

function App() {
  return (
    <div>
      {/* navigation bar stays on all pages */}
      <Navbar />

      {/* routing for different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modes" element={<Modes />} />
        <Route path="/estimator" element={<Estimator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/live" element={<LiveTransport />} />
      </Routes>
    </div>
  )
}

export default App