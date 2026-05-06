import { useState, useEffect } from "react"

function Dashboard() {
  const [last, setLast] = useState({
    distance: "",
    modeOne: "",
    modeTwo: "",
  })

  // store history
  const [history, setHistory] = useState([])

  useEffect(() => {
    setLast({
      distance: localStorage.getItem("compareDistance"),
      modeOne: localStorage.getItem("compareModeOne"),
      modeTwo: localStorage.getItem("compareModeTwo"),
    })

    setHistory(JSON.parse(localStorage.getItem("history")) || [])
  }, [])

  // check if we have data
  const hasData = last.distance && last.modeOne && last.modeTwo

  // clear history
  function clearHistory() {
    localStorage.removeItem("history")
    setHistory([])
  }

  return (
    <div className="page">

      <section className="page-hero">
        <p className="section-tag">User data</p>
        <h1>Dashboard</h1>
        <p className="page-hero-text">
          View your recent comparisons and saved travel history.
        </p>
      </section>

      <div className="dashboard-card">

        <h3>Your Last Comparison</h3>

        {hasData ? (
          <>
            <p><strong>Distance:</strong> {last.distance}</p>
            <p><strong>Modes:</strong> {last.modeOne} vs {last.modeTwo}</p>
          </>
        ) : (
          <p>No recent activity</p>
        )}

        <h4 style={{ marginTop: "15px" }}>History</h4>

        {history.length > 0 ? (
          history.map((item, index) => (
            <p key={index}>
              {item.distance} km → {item.modeOne} vs {item.modeTwo}
            </p>
          ))
        ) : (
          <p>No history yet</p>
        )}

        <button onClick={clearHistory}>
          Clear History
        </button>

      </div>
    </div>
  )
}

export default Dashboard