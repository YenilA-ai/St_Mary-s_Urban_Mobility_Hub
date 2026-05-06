import { useEffect, useState } from "react"

function LiveUpdates() {
  const [updates, setUpdates] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = () => {
      fetch("https://api.tfl.gov.uk/Line/Mode/tube/Status")
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(line => ({
            name: line.name,
            status: line.lineStatuses?.[0]?.statusSeverityDescription || "No status"
          }))
          setUpdates(formatted)
        })
        .catch(() => setError("Failed to load updates"))
    }

    fetchData() // first load

    const interval = setInterval(fetchData, 10000) // every 10 sec

    return () => clearInterval(interval)
  }, [])

function getStatusColor(status) {
  if (status.includes("Good")) return "green"
  if (status.includes("Minor")) return "orange"
  if (status.includes("Severe") || status.includes("Delay")) return "red"
  return "gray"
}

  return (
    <div className="live-updates-box">
      <h3>Live TfL Updates</h3>

      {error && <p className="error-text">{error}</p>}

      {!error && updates.length === 0 && <p>Loading updates...</p>}

      {updates.map((u, i) => (
        <div key={i} className="live-update-item">
          <strong>{u.name}</strong>
          <p style={{ color: getStatusColor(u.status), fontWeight: "600" }}>
            {u.status}
          </p>
        </div>
      ))}
    </div>
  )
}

export default LiveUpdates