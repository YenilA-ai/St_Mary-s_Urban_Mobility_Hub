import { useEffect, useState } from "react"

function LiveTransport() {
  const [updates, setUpdates] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    function fetchData() {
      setLoading(true)

      fetch("https://api.tfl.gov.uk/Line/Mode/tube/Status")
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(line => ({
            name: line.name,
            status:
              line.lineStatuses?.[0]?.statusSeverityDescription ||
              "No status"
          }))

          // sort so worst disruptions appear first
          const sorted = formatted.sort((a, b) => {
            const priority = s => {
              if (s.includes("Severe")) return 3
              if (s.includes("Delay")) return 2
              if (s.includes("Minor")) return 1
              return 0
            }
            return priority(b.status) - priority(a.status)
          })

          setUpdates(sorted)
          setLastUpdated(new Date().toLocaleTimeString())
          setError(null)
          setLoading(false)
        })
        .catch(() => {
          setError("Failed to load updates")
          setLoading(false)
        })
    }

    fetchData()

    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
  }, [])

  function getStatusColor(status) {
    const s = status.toLowerCase()
    if (s.includes("good")) return "green"
    if (s.includes("minor")) return "orange"
    if (s.includes("severe") || s.includes("delay")) return "red"
    return "gray"
  }

  return (
    <div className="page">

      <section className="page-hero">
        <h1>Live Transport Updates</h1>
        <p>Real-time London Underground status</p>
      </section>

      <div className="live-updates-box">

        {loading && <p>Loading updates...</p>}

        {error && <p className="error-text">{error}</p>}

        {!loading && !error && updates.length === 0 && (
          <p>No updates available</p>
        )}

        {!loading && !error && updates.map((u, i) => (
          <div key={i} className="live-update-item">
            <strong>{u.name}</strong>
            <p
              style={{
                color: getStatusColor(u.status),
                fontWeight: "600"
              }}
            >
              {u.status}
            </p>
          </div>
        ))}

        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated}
          </p>
        )}

      </div>
    </div>
  )
}

export default LiveTransport