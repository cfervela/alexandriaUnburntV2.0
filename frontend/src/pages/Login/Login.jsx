import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../../context/AuthContext"
import "./Login.css"

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await login(email, password)
      if (data.user.role === "admin") {
        navigate("/booksAdmin")
      } else {
        navigate("/catalogue")
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <h2>Welcome back</h2>
        <span>Sign in to your account</span>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
