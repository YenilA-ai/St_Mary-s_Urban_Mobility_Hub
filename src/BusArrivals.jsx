import { useEffect, useState } from "react"

function BusArrivals() {
  const [buses, setBuses] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBusData = () => {
      fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals")
        .then(res => res.json())
        .then(data => {
          const sorted = data
            .sort((a, b) => a.timeToStation - b.timeToStation)
            .slice(0, 5) // show top 5 buses

          const formatted = sorted.map(bus => ({
            line: bus.lineName,
            destination: bus.destinationName,
            time: Math.round(bus.timeToStation / 60)
          }))

          setBuses(formatted)
        })
        .catch(() => setError("Failed to load bus arrivals"))
    }

    fetchBusData()

    const interval = setInterval(fetchBusData, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="live-updates-box">
      <h3>Live Bus Arrivals</h3>

      {error && <p className="error-text">{error}</p>}

      {buses.map((bus, i) => (
        <div key={i} className="bus-item">
          <strong>{bus.line}</strong>
          <p>{bus.destination}</p>
          <span>{bus.time} min</span>
        </div>
      ))}
    </div>
  )
}

export default BusArrivals