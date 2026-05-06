import busImage from "./Image/bus.jpg"
import railImage from "./Image/rail.avif"
import cycleImage from "./Image/cycle.jpg"
import walkImage from "./Image/walking.png"

function Modes() {
  const transportData = [
    {
      title: "Bus",
      image: busImage,
      shortText: "Affordable daily travel for medium distance journeys.",
      pros: ["Affordable", "Useful for medium trips", "Easy access"],
      cons: ["Traffic delays", "Can be crowded"],
      extra: "Fare depends on travel distance.",
    },
    {
      title: "Rail",
      image: railImage,
      shortText: "Fast transport for long journeys.",
      pros: ["Fast", "Reliable", "Comfortable"],
      cons: ["Expensive", "Limited routes"],
      extra: "Best option for long distance travel.",
    },
    {
      title: "Cycling",
      image: cycleImage,
      shortText: "Eco friendly and flexible travel option.",
      pros: ["Low cost", "Healthy", "Environment friendly"],
      cons: ["Weather issues", "Takes longer"],
      extra: "Personal bicycle is free. Shared bikes may cost a small fee.",
    },
    {
      title: "Walking",
      image: walkImage,
      shortText: "Free and healthy for short distances.",
      pros: ["Free", "Healthy", "Simple"],
      cons: ["Slow", "Weather dependent"],
      extra: "Best for nearby locations.",
    },
  ]

  return (
    <div className="page">
      <section className="page-hero">
        <p className="section-tag">Transport modes</p>
        <h1>Explore Transport Options</h1>
        <p className="page-hero-text">
          Learn about different ways to travel and choose the best option.
        </p>
      </section>

      <section className="modes-grid">
        {transportData.map((item, index) => (
          <div
            className="mode-card"
            key={item.title}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="mode-image-box">
              <img src={item.image} alt={item.title} className="mode-image" />
            </div>

            <div className="mode-content">
              <h2>{item.title}</h2>
              <p className="mode-short-text">{item.shortText}</p>

              <div className="mode-detail-box">
                <h3>Pros</h3>
                <ul>
                  {item.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>

              <div className="mode-detail-box mode-detail-box-cons">
                <h3>Cons</h3>
                <ul>
                  {item.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>

              <p className="mode-extra">{item.extra}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Modes