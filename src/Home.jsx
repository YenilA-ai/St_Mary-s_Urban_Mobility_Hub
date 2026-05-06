import { Link } from "react-router-dom"

// images
import busHomeImage from "./Image/Bus.png"
import railHomeImage from "./Image/Rail.jpg"
import cycleImage from "./Image/cycle.jpg"
import walkingImage from "./Image/walking.png"
import mainImage from "./Image/Home-Main.jpg"

// components
import LiveUpdates from "./LiveUpdates"
import Dashboard from "./Dashboard"
import BusArrivals from "./BusArrivals"
import TrainArrivals from "./TrainArrivals"

function Home() {

  // simple data for transport cards
  const transportCards = [
    {
      title: "Bus",
      image: busHomeImage,
      text: "Affordable and simple for daily university travel.",
      link: "/modes",
    },
    {
      title: "Rail",
      image: railHomeImage,
      text: "A fast option for longer distance journeys.",
      link: "/modes",
    },
    {
      title: "Cycling",
      image: cycleImage,
      text: "A flexible and healthy way to travel nearby.",
      link: "/modes",
    },
    {
      title: "Walking",
      image: walkingImage,
      text: "Best for short distances around the campus area.",
      link: "/modes",
    },
  ]

  return (
    <div className="page">

      {/* hero section with background */}
      <section
        className="hero-banner"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-left-box">
          <p className="hero-welcome">
            Welcome to St Mary’s University Urban Mobility Hub
          </p>

          <p className="hero-main-text">
            Explore available transport options at St Mary’s University.
          </p>

          {/* quick actions */}
          <div className="hero-action-block">
            <h3>Explore modes</h3>
            <p>View the different transport modes available.</p>
            <Link to="/modes" className="hero-btn">
              Explore Modes
            </Link>
          </div>

          <div className="hero-action-block">
            <h3>Estimate your travel fare</h3>
            <p>Calculate cost and travel time easily.</p>
            <Link to="/estimator" className="hero-btn secondary-btn">
              Estimator
            </Link>
          </div>
        </div>
      </section>

      {/* transport cards */}
      <section className="transport-overview">
        <div className="section-heading">
          <p className="section-tag">Travel options</p>
          <h2>Explore transport modes</h2>
          <p className="section-text">
            Discover the main ways to travel at St Mary’s University.
          </p>
        </div>

        <div className="transport-card-grid">
          {transportCards.map((item) => (
            <div className="transport-home-card" key={item.title}>
              <div className="transport-home-image-box">
                <img
                  src={item.image}
                  alt={item.title}
                  className="transport-home-image"
                />
              </div>

              <div className="transport-home-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link to={item.link} className="transport-home-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* live updates section */}
      <section className="live-section">
        <LiveUpdates />
        <BusArrivals />
        <TrainArrivals />
      </section>
    </div>
  )
}

export default Home