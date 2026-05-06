import { useEffect, useState } from "react"

function TrainArrivals() {
  const [trains, setTrains] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrains = () => {
      fetch("https://api.tfl.gov.uk/StopPoint/940GZZLUVIC/Arrivals")
        .then(res => res.json())
        .then(data => {
          const sorted = data
            .sort((a, b) => a.timeToStation - b.timeToStation)
            .slice(0, 5)

          const formatted = sorted.map(train => ({
            line: train.lineName,
            destination: train.destinationName,
            time: Math.round(train.timeToStation / 60)
          }))

          setTrains(formatted)
        })
        .catch(() => setError("Failed to load train arrivals"))
    }

    fetchTrains()
    const interval = setInterval(fetchTrains, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="live-updates-box">
      <h3>Live Tube Arrivals (Victoria Station)</h3>

      {error && <p className="error-text">{error}</p>}

      {trains.map((t, i) => (
        <div key={i} className="bus-item">
          <strong>{t.line}</strong>
          <p>{t.destination}</p>
          <span>{t.time} min</span>
        </div>
      ))}
    </div>
  )
}

export default TrainArrivals