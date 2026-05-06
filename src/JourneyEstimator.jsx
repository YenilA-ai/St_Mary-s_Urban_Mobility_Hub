function JourneyEstimator({ from, to, mode, setResult, setLoading }) {

  const apiMode =
    mode === "Bus"
      ? "bus"
      : "tube,overground,dlr,elizabeth-line"

  fetch(
    `https://api.tfl.gov.uk/Journey/JourneyResults/${from.lat},${from.lon}/to/${to.lat},${to.lon}?mode=${apiMode}&journeyPreference=leasttime`
  )
    .then(res => res.json())
    .then(data => {

      const journey = data.journeys?.[0]

      if (!journey) {
        setResult({ error: "No route found." })
        setLoading(false)
        return
      }

      const arrival = new Date(journey.arrivalDateTime)
      const depart = new Date(journey.startDateTime)

      const legs = journey.legs.map(l => ({
        mode: l.mode.name,
        line: l.routeOptions?.[0]?.name || l.mode.name,
        from: l.departurePoint.commonName,
        to: l.arrivalPoint.commonName
      }))

      setResult({
        type: "journey",
        duration: journey.duration,
        arrival: arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        depart: depart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        legs
      })

      setLoading(false)
    })
    .catch(() => {
      setResult({ error: "API failed." })
      setLoading(false)
    })
}

export default JourneyEstimator