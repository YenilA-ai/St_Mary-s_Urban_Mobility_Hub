import { Routes, Route } from "react-router-dom"

import Navbar from "./Navbar"
import Home from "./Home"
import Modes from "./Modes"
import Estimator from "./Estimator"
import Compare from "./Compare"
import Dashboard from "./Dashboard"
import LiveTransport from "./LiveTransport"

function EstimatorPage() {
  return (
    <div className="layout">
      <Estimator />
    </div>
  )
}

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modes" element={<Modes />} />
        <Route path="/estimator" element={<Estimator />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/live" element={<LiveTransport />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App