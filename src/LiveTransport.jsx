import { useState } from "react"

function Estimator() {
  const [distance, setDistance] = useState("")
  const [unit, setUnit] = useState("km")
  const [mode, setMode] = useState("Bus")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [fromLabel, setFromLabel] = useState("")
  const [toLabel, setToLabel] = useState("")

  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])

  const isJourneyMode = mode === "Bus" || mode === "Rail"

  function kmValue(v, u) {
    const n = parseFloat(v)
    if (!n || n <= 0) return null
    return u === "miles" ? n * 1.60934 : n
  }

  function formatDuration(m) {
    const h = Math.floor(m / 60)
    const min = m % 60
    if (h && min) return `${h} hr ${min} min`
    if (h) return `${h} hr`
    return `${min} min`
  }

  function searchLocation(value, setSuggestions) {
    if (value.length < 2) {
      setSuggestions([])
      return
    }

    fetch(`https://api.tfl.gov.uk/Place/Search?name=${value}&types=StopPoint,Station`)
      .then(res => res.json())
      .then(data => {
        const results = data.matches || []
        const valid = results.filter(p => p.lat && p.lon)
        setSuggestions(valid.slice(0, 5))
      })
      .catch(() => setSuggestions([]))
  }

  function handleCalculate() {
    setResult(null)

    if (isJourneyMode) {
      if (!from || !to) {
        setResult({ error: "Please select locations from the dropdown." })
        return
      }

      setLoading(true)

      let apiMode = ""
      if (mode === "Bus") apiMode = "bus"
      if (mode === "Rail") apiMode = "tube,overground,dlr,elizabeth-line,national-rail"

      fetch(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${from.lat},${from.lon}/to/${to.lat},${to.lon}?mode=${apiMode}&journeyPreference=leasttime`
      )
        .then(res => res.json())
        .then(data => {
          if (!data.journeys || data.journeys.length === 0) {
            setResult({ error: "No route found." })
            setLoading(false)
            return
          }

          const journey = data.journeys[0]

          const legs = journey.legs
            .filter(l => {
              if (mode === "Bus") return l.mode.name === "bus"
              if (mode === "Rail") return l.mode.name !== "bus"
              return true
            })
            .map(l => ({
              mode: l.mode.name,
              line: l.routeOptions?.[0]?.name || l.mode.name,
              from: l.departurePoint.commonName,
              to: l.arrivalPoint.commonName,
              depart: new Date(l.departureTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              arrive: new Date(l.arrivalTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              instruction: l.instruction?.summary || ""
            }))

          const arrival = new Date(journey.arrivalDateTime)
          const depart = new Date(journey.startDateTime)

          let cost = 0
          legs.forEach(l => {
            if (l.mode === "bus") cost += 1.75
            if (l.mode === "tube") cost += 3
          })

          setResult({
            type: "journey",
            duration: journey.duration,
            arrival: arrival.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            depart: depart.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            legs,
            cost: cost.toFixed(2)
          })

          setLoading(false)
        })
        .catch(() => {
          setResult({ error: "API error. Try again." })
          setLoading(false)
        })

      return
    }

    const km = kmValue(distance, unit)

    if (!km) {
      setResult({ error: "Enter valid distance." })
      return
    }

    let time = 0
    let cost = null

    if (mode === "Normal Cycle") time = Math.round((km / 15) * 60)
    if (mode === "Electric Cycle") {
      time = Math.round((km / 20) * 60)
      cost = (km * 0.35).toFixed(2)
    }
    if (mode === "Walking") time = Math.round((km / 5) * 60)

    setResult({
      type: "distance",
      distance: km.toFixed(2),
      time: formatDuration(time),
      cost
    })
  }

  return (
    <div className="page">

      <section className="page-hero">
        <h1>Fare and Journey Estimator</h1>
      </section>

      <div className="estimator-card">

        <label>Transport Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option>Bus</option>
          <option>Rail</option>
          <option>Normal Cycle</option>
          <option>Electric Cycle</option>
          <option>Walking</option>
        </select>

        {!isJourneyMode && (
          <>
            <label>Distance</label>
            <input value={distance} onChange={(e) => setDistance(e.target.value)} />

            <label>Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="km">km</option>
              <option value="miles">miles</option>
            </select>
          </>
        )}

        {isJourneyMode && (
          <>
            <label>From</label>
            <input
              value={fromLabel}
              onChange={(e) => {
                setFromLabel(e.target.value)
                setFrom(null)
                searchLocation(e.target.value, setFromSuggestions)
              }}
            />

            {fromSuggestions.map(item => (
              <div key={item.id} className="suggestion-item"
                onClick={() => {
                  setFrom({ lat: item.lat, lon: item.lon })
                  setFromLabel(item.name)
                  setFromSuggestions([])
                }}>
                {item.name}
              </div>
            ))}

            <label>To</label>
            <input
              value={toLabel}
              onChange={(e) => {
                setToLabel(e.target.value)
                setTo(null)
                searchLocation(e.target.value, setToSuggestions)
              }}
            />

            {toSuggestions.map(item => (
              <div key={item.id} className="suggestion-item"
                onClick={() => {
                  setTo({ lat: item.lat, lon: item.lon })
                  setToLabel(item.name)
                  setToSuggestions([])
                }}>
                {item.name}
              </div>
            ))}
          </>
        )}

        <button onClick={handleCalculate}>Calculate</button>

        {loading && <p>Loading...</p>}
        {result?.error && <p>{result.error}</p>}
      </div>

      {result?.type === "journey" && (
        <div className="result-box">
          <h3>Journey Result</h3>

          <p>{result.depart} → {result.arrival}</p>
          <p>{result.duration} min</p>
          <p>Cost: £{result.cost}</p>

          {result.legs.map((l, i) => (
            <div key={i}>
              <strong>{l.line}</strong> ({l.mode}) <br />
              {l.from} → {l.to} <br />
              {l.depart} → {l.arrive} <br />
              {l.instruction}
            </div>
          ))}
        </div>
      )}

      {result?.type === "distance" && (
        <div className="result-box">
          <p>{result.distance} km</p>
          <p>{result.time}</p>
          {result.cost && <p>£{result.cost}</p>}
        </div>
      )}
    </div>
  )
}

export default Estimator