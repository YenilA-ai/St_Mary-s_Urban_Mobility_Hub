import { useEffect, useState } from "react"

function Estimator() {

  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)

  const [fromLabel, setFromLabel] = useState("")
  const [toLabel, setToLabel] = useState("")

  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])

  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)

  const [journeys, setJourneys] = useState([])

  const [loading, setLoading] = useState(false)

  const [tubeUpdates, setTubeUpdates] = useState([])

  const [selectedMode, setSelectedMode] = useState("all")

  const londonLocations = [

  "Kingston",
  "Twickenham",
  "Richmond",
  "Wimbledon",
  "Croydon",
  "Stratford",
  "Canary Wharf",
  "Waterloo",
  "Victoria",
  "Paddington",
  "Ealing",
  "Hounslow",
  "Wembley",
  "Camden",
  "Soho",
  "Greenwich",
  "Uxbridge",
  "Brixton",
  "Harrow",
  "Ilford",
  "Romford",
  "Barnet",
  "Enfield",
  "Barking",
  "Lewisham",
  "Putney",
  "Clapham",
  "Chelsea",
  "Kensington",
  "Fulham",
  "Tooting",
  "Balham",
  "Acton",
  "Brentford",
  "Chiswick",
  "Hammersmith",
  "Shepherd's Bush",
  "Liverpool Street",
  "London Bridge",
  "Bank",
  "Moorgate",
  "Southall",
  "Whitechapel",
  "North Greenwich",
  "Morden",
  "Bexley",
  "Surbiton",
  "New Malden",
  "Sutton",
  "Bromley"

]

  // SEARCH LOCATIONS
function searchLocation(value, setSuggestions) {

  if (value.trim().length < 1) {
    setSuggestions([])
    return
  }

  fetch(
    `https://api.tfl.gov.uk/StopPoint/Search/${encodeURIComponent(value)}`
  )

    .then(res => res.json())

    .then(data => {

      const results = (data.matches || [])

        .filter(item => item.name)

        .map(item => ({
          id: item.id,
          name: item.name,
          lat: item.lat,
          lon: item.lon
        }))

      const unique = results.filter(
        (item, index, self) =>
          index === self.findIndex(
            t => t.name === item.name
          )
      )

      setSuggestions(unique.slice(0, 10))
    })

    .catch(() => {
      setSuggestions([])
    })
}

  // PLAN JOURNEY
  function planJourney() {

    if (!from || !to) {
      alert("Please select both locations")
      return
    }

    setLoading(true)

    setJourneys([])

    let modes = ""

    if (selectedMode !== "all") {
      modes = `&mode=${selectedMode}`
    }

    fetch(
      `https://api.tfl.gov.uk/Journey/JourneyResults/${from.lat},${from.lon}/to/${to.lat},${to.lon}?${modes}`
    )

      .then(res => res.json())

      .then(data => {

        if (!data.journeys?.length) {
          alert("No journey found")
          setLoading(false)
          return
        }

        const formattedJourneys = data.journeys
          .slice(0, 4)
          .map(journey => ({

            duration: journey.duration,

            fare: journey.fare?.totalCost
              ? (journey.fare.totalCost / 100).toFixed(2)
              : "N/A",

            startDateTime: journey.startDateTime,

            arrivalDateTime: journey.arrivalDateTime,

            legs: journey.legs.map(leg => ({

              mode: leg.mode.name,

              line:
                leg.routeOptions?.[0]?.name ||
                leg.lineName ||
                leg.mode.name,

              from: leg.departurePoint.commonName,

              to: leg.arrivalPoint.commonName,

              depart: new Date(
                leg.departureTime
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),

              arrive: new Date(
                leg.arrivalTime
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),

              duration: leg.duration,

              instruction:
                leg.instruction?.summary || ""

            }))
          }))

        setJourneys(formattedJourneys)

        setLoading(false)
      })

      .catch(() => {

        alert("Journey planning failed")

        setLoading(false)
      })
  }


  // GET LIVE TUBE STATUS
  useEffect(() => {

    fetch("https://api.tfl.gov.uk/Line/Mode/tube/Status")

      .then(res => res.json())

      .then(data => {

        setTubeUpdates(data.slice(0, 6))
      })

      .catch(() => {
        setTubeUpdates([])
      })

  }, [])

  return (

    <div className="page">

      <div className="planner-layout">

        {/* LEFT */}
        <div className="planner-main-card">

          <h1>Smart Journey Planner</h1>

          {/* FROM */}
          <label>From</label>

          <div className="input-wrapper">

              <input
                type="text"
                value={fromLabel}
                placeholder="Search London location"

                onFocus={() => {

                  setShowFrom(true)

                  searchLocation(
                    "London",
                    setFromSuggestions
                  )
                }}

                onChange={(e) => {

                  setFromLabel(e.target.value)

                  setFrom(null)

                  searchLocation(
                    e.target.value,
                    setFromSuggestions
                  )
                }}
              />
            {showFrom && fromSuggestions.length > 0 && (

              <div className="dropdown-box">

                {fromSuggestions.map(item => (

                  <div
                    key={item.id}
                    className="dropdown-item"

                    onClick={() => {

                        fetch(`https://api.tfl.gov.uk/StopPoint/${item.id}`)
                          .then(res => res.json())
                          .then(full => {

                            setFrom({
                              lat: full.lat,
                              lon: full.lon,
                              name: full.commonName
                            })

                            setFromLabel(full.commonName)

                            setFromSuggestions([])

                            setShowFrom(false)
                          })

                      setFromLabel(item.name)

                      setFromSuggestions([])

                      setShowFrom(false)
                    }}
                  >

                    <strong>{item.name}</strong>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* TO */}
          <label>To</label>

          <div className="input-wrapper">

              <input
                type="text"
                value={toLabel}
                placeholder="Search destination"

                onFocus={() => {

                  setShowTo(true)

                  searchLocation(
                    "London",
                    setToSuggestions
                  )
                }}

                onChange={(e) => {

                  setToLabel(e.target.value)

                  setTo(null)

                  searchLocation(
                    e.target.value,
                    setToSuggestions
                  )
                }}
              />
            {showTo && toSuggestions.length > 0 && (

              <div className="dropdown-box">

                {toSuggestions.map(item => (

                  <div
                    key={item.id}
                    className="dropdown-item"

                    onClick={() => {

                      fetch(`https://api.tfl.gov.uk/StopPoint/${item.id}`)
                        .then(res => res.json())
                        .then(full => {

                          setTo({
                            lat: full.lat,
                            lon: full.lon,
                            name: full.commonName
                          })

                          setToLabel(full.commonName)

                          setToSuggestions([])

                          setShowTo(false)
                        })

                      setToLabel(item.name)

                      setToSuggestions([])

                      setShowTo(false)
                    }}
                  >

                    <strong>{item.name}</strong>
                  </div>

                ))}

              </div>

            )}

          </div>

          {/* MODE SELECT */}
          <label>Transport Mode</label>

          <select
            className="mode-select"
            value={selectedMode}
            onChange={(e) => {
              setSelectedMode(e.target.value)
            }}
          >

            <option value="all">
              All Modes
            </option>

            <option value="bus">
              Bus
            </option>

            <option value="tube">
              Tube
            </option>

            <option value="national-rail">
              National Rail
            </option>

            <option value="walking">
              Walking
            </option>

            <option value="cycle">
              Cycle
            </option>

          </select>

          {/* BUTTON */}
          <button
            className="journey-btn"
            onClick={planJourney}
          >

            Calculate Journey

          </button>

          {/* LOADING */}
          {loading && (

            <p className="loading-text">
              Fetching live TfL data...
            </p>

          )}

          {/* RESULTS */}
          {journeys.length > 0 && (

            <div className="journey-results">

              {journeys.map((journey, journeyIndex) => (

                <div
                  className="journey-card"
                  key={journeyIndex}
                >

                  <div className="summary-box">

                    <div className="summary-item">

                      <span>Duration</span>

                      <strong>
                        {journey.duration} mins
                      </strong>

                    </div>

                    <div className="summary-item">

                      <span>Fare</span>

                      <strong>
                        £{journey.fare}
                      </strong>

                    </div>

                  </div>

                  <div className="legs-box">

                    {journey.legs.map((leg, index) => (

                      <div
                        className="leg-card"
                        key={index}
                      >

                        <div className="leg-top">

                          <h3>
                            {leg.line}
                          </h3>

                          <span>
                            {leg.mode}
                          </span>

                        </div>

                        <p>
                          {leg.from}
                        </p>

                        <p className="arrow">
                          ↓
                        </p>

                        <p>
                          {leg.to}
                        </p>

                        <div className="time-row">

                          <span>
                            {leg.depart}
                          </span>

                          <span>
                            {leg.arrive}
                          </span>

                        </div>

                        <div className="leg-bottom">

                          <small>
                            {leg.duration} mins
                          </small>

                          <small>
                            {leg.instruction}
                          </small>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* RIGHT PANEL */}
        <div className="live-card">

          <h2>Live TfL Updates</h2>

          {tubeUpdates.map((tube, index) => (

            <div
              className="tube-item"
              key={index}
            >

              <div className="tube-top">

                <h4>
                  {tube.name}
                </h4>

              </div>

              <p>

                {
                  tube.lineStatuses?.[0]
                    ?.statusSeverityDescription
                }

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}

export default Estimator