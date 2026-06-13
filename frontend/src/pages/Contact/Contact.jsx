import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import apiClient from "../../services/apiClient"
import "./Contact.css"

const Contact = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = () => {
    if (!name.trim()) return "Name is required"
    if (!isAuthenticated && !emailRegex.test(email)) return "Enter a valid email address"
    if (!subject.trim()) return "Subject is required"
    if (body.trim().length < 10) return "Message must be at least 10 characters"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await apiClient.post("/messages", {
        name: name.trim(),
        email: isAuthenticated ? user.email : email.trim(),
        subject: subject.trim(),
        body: body.trim(),
        userId: user?.userId || null,
      })
      setSuccess("Message sent! We'll get back to you soon.")
      setName("")
      setEmail("")
      setSubject("")
      setBody("")
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact-page">
      <div className="contact-card">
        <h2>Contact Us</h2>
        <span>Have a question or feedback? We'd love to hear from you.</span>

        {success && (
          <div className="contact-success">
            <i className="bi bi-check-circle"></i> {success}
            <button className="btn browse-btn" onClick={() => setSuccess("")}>
              Send another message
            </button>
            <button className="btn browse-btn" onClick={() => navigate("/catalogue")} style={{ marginLeft: "0.5rem", background: "#2B3349" }}>
              Browse Catalogue
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAuthenticated}
              />
            </div>

            {!isAuthenticated && (
              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="contact-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="What is this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="body">
                Message
                <span className={`char-count ${body.length > 200 ? "char-limit" : ""}`}>
                  {body.length}/200
                </span>
              </label>
              <textarea
                id="body"
                rows={4}
                maxLength={200}
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            {error && <p className="contact-error">{error}</p>}

            <button className="btn contact-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Contact
