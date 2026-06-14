import { useNavigate } from "react-router"
import "./NotFound.css"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>Page not found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <button className="btn not-found-btn" onClick={() => navigate("/")}>
          <i className="bi bi-house-door"></i> Back to Home
        </button>
      </div>
    </div>
  )
}

export default NotFound
