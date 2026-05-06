function DistanceEstimator(distance, unit, mode, setResult) {

  const km = parseFloat(distance)
  if (!km || km <= 0) {
    setResult({ error: "Enter valid distance." })
    return
  }

  let time = 0
  let cost = 0

  if (mode === "Normal Cycle") {
    time = Math.round((km / 15) * 60)
  }

  if (mode === "Electric Cycle") {
    time = Math.round((km / 20) * 60)
    cost = km * 0.35
  }

  if (mode === "Walking") {
    time = Math.round((km / 5) * 60)
  }

  setResult({
    type: "distance",
    distance: km.toFixed(2),
    time,
    cost: cost.toFixed(2)
  })
}

export default DistanceEstimator