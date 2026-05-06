import { useEffect, useState } from "react"

function Compare() {
  const [distance, setDistance] = useState("")
  const [unit, setUnit] = useState("km")
  const [modeOne, setModeOne] = useState("Bus")
  const [modeTwo, setModeTwo] = useState("Rail")
  const [result, setResult] = useState(null)
  const [warning, setWarning] = useState("")

  // load saved values
  useEffect(() => {
    setDistance(localStorage.getItem("compareDistance") || "")
    setUnit(localStorage.getItem("compareUnit") || "km")
    setModeOne(localStorage.getItem("compareModeOne") || "Bus")
    setModeTwo(localStorage.getItem("compareModeTwo") || "Rail")
  }, [])

  function kmValue(value, selectedUnit) {
    const num = parseFloat(value)
    if (!num || num <= 0) return null
    return selectedUnit === "miles" ? num * 1.60934 : num
  }

  function getModeResult(mode, distance) {
    let cost = 0, time = 0, co2 = 0, convenience = ""

    if (mode === "Bus") {
      cost = 2 + distance * 0.15
      time = distance * 3
      co2 = distance * 80
      convenience = "Cheap and common for daily travel"
    }

    if (mode === "Rail") {
      cost = 3 + distance * 0.25
      time = distance * 1.8
      co2 = distance * 45
      convenience = "Fast option for longer journeys"
    }

    if (mode === "Normal Cycle") {
      time = distance * 4
      convenience = "Healthy and environmentally friendly"
    }

    if (mode === "Electric Cycle") {
      cost = distance * 0.1
      time = distance * 2.5
      co2 = distance * 5
      convenience = "Faster but costs money"
    }

    if (mode === "Walking") {
      time = distance * 10
      convenience = "Best for short distance"
    }

    const arrival = new Date(Date.now() + time * 60000)

    return {
      mode,
      cost: cost.toFixed(2),
      time,
      co2: co2.toFixed(0),
      convenience,
      arrival: arrival.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
    }
  }

  function getBestOption(a, b) {
    if (a.co2 < b.co2 && a.time <= b.time)
      return `${a.mode} is recommended based on lower emissions and efficiency.`

    if (b.co2 < a.co2 && b.time <= a.time)
      return `${b.mode} is more eco-friendly and efficient.`

    if (parseFloat(a.cost) < parseFloat(b.cost) && a.time <= b.time)
      return `${a.mode} is cheaper and efficient.`

    if (parseFloat(b.cost) < parseFloat(a.cost) && b.time <= a.time)
      return `${b.mode} is cheaper and efficient.`

    if (a.time < b.time) return `${a.mode} is faster.`
    if (b.time < a.time) return `${b.mode} is faster.`

    return "Both options have similar performance."
  }

  function handleCompare() {
    setResult(null)

    if (!distance) {
      setResult({ error: "Enter any value before comparing." })
      return
    }

    const distanceInKm = kmValue(distance, unit)

    if (!distanceInKm) {
      setResult({ error: "Please enter a valid distance." })
      return
    }

    if (modeOne === modeTwo) {
      setResult({ error: "Choose two different transport modes." })
      return
    }

    // warning (no alert)
    if (distanceInKm > 100) {
      setWarning("Long journey detected. Faster or rail options are recommended.")
    } else {
      setWarning("")
    }

    const firstMode = getModeResult(modeOne, distanceInKm)
    const secondMode = getModeResult(modeTwo, distanceInKm)
    const bestOption = getBestOption(firstMode, secondMode)

    // save history (clean)
    const history = JSON.parse(localStorage.getItem("history")) || []
    const updatedHistory = [{ distance, modeOne, modeTwo }, ...history].slice(0, 5)

    localStorage.setItem("history", JSON.stringify(updatedHistory))

    setResult({
      error: null,
      distanceInKm: distanceInKm.toFixed(2),
      firstMode,
      secondMode,
      bestOption,
    })
  }

  return (
    <div className="page">
      <section className="page-hero">
        <p className="section-tag">Journey comparison</p>
        <h1>Compare Travel Modes</h1>
        <p className="page-hero-text">
          Compare two transport options based on cost, time, and convenience.
        </p>
      </section>

      <section className="compare-layout">

        <div className="compare-card">
          <label>Distance</label>
          <input
            type="number"
            placeholder="Enter distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />

          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="km">Kilometres</option>
            <option value="miles">Miles</option>
          </select>

          <label>First transport mode</label>
          <select value={modeOne} onChange={(e) => setModeOne(e.target.value)}>
            <option>Bus</option>
            <option>Rail</option>
            <option>Normal Cycle</option>
            <option>Electric Cycle</option>
            <option>Walking</option>
          </select>

          <label>Second transport mode</label>
          <select value={modeTwo} onChange={(e) => setModeTwo(e.target.value)}>
            <option>Bus</option>
            <option>Rail</option>
            <option>Normal Cycle</option>
            <option>Electric Cycle</option>
            <option>Walking</option>
          </select>

          {/* FIXED BUTTON */}
          <button type="button" onClick={handleCompare}>
            Compare
          </button>

          {warning && <p className="warning-text">{warning}</p>}
          {result?.error && <p className="error-text">{result.error}</p>}
        </div>

        {result && !result.error && (
          <div className="compare-result-box">
            <h3>Comparison Result</h3>

            <p className="compare-distance">
              Distance: <strong>{result.distanceInKm} km</strong>
            </p>

            <p className="compare-best-option">
              Best option: {result.bestOption}
            </p>

            <p className="compare-note">
              Recommendation is based on cost, time, and CO₂ emissions.
            </p>

            <div className="compare-chart">
              <h4>Time Comparison</h4>

              {[result.firstMode, result.secondMode].map((m) => (
                <div key={m.mode} className="bar-container">
                  <p>{m.mode}</p>
                  <div className="bar" style={{ width: `${m.time * 2}px` }}>
                    {m.time} mins
                  </div>
                </div>
              ))}
            </div>

            <div className="compare-result-grid">
              {[result.firstMode, result.secondMode].map((m) => (
                <div
                  key={m.mode}
                  className={`compare-mode-box ${
                    result.bestOption.includes(m.mode) ? "recommended-card" : ""
                  } ${m.co2 == 0 ? "eco-card" : ""}`}
                >
                  <h4>
                    {m.mode}
                    {result.bestOption.includes(m.mode) && (
                      <span className="recommended-badge">Recommended</span>
                    )}
                  </h4>

                  <p><strong>Cost:</strong> £{m.cost}</p>
                  <p><strong>Time:</strong> {m.time} mins</p>
                  <p><strong>Arrival:</strong> {m.arrival}</p>
                  <p><strong>CO₂ emissions:</strong> {m.co2} g</p>
                  <p><strong>Details:</strong> {m.convenience}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </section>
    </div>
  )
}

export default Compare