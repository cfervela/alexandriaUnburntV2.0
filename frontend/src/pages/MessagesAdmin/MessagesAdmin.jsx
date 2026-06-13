import { useEffect, useState } from "react"
import apiClient from "../../services/apiClient"
import "./MessagesAdmin.css"

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    apiClient.get("/messages")
      .then(res => setMessages(res.data))
      .catch(() => {})
  }, [])

  const msgPerPage = 8
  const totalPages = Math.ceil(messages.length / msgPerPage)
  const paginated = messages.slice(
    (currentPage - 1) * msgPerPage,
    currentPage * msgPerPage
  )

  const formatDate = (iso) => {
    if (!iso) return "—"
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  return (
    <div className="MessagesAdmin">
      <h1 className="Title">Contact Messages</h1>

      <table className="msg-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>From</th>
            <th>Subject</th>
            <th>Message</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(msg => (
            <tr key={msg.messageId}>
              <td>{msg.messageId}</td>
              <td>{formatDate(msg.sentData)}</td>
              <td>{msg.email}</td>
              <td>{msg.subject}</td>
              <td className="msg-body">{msg.message}</td>
              <td>
                {msg.name ? (
                  <span className="msg-user">{msg.name}</span>
                ) : (
                  <span className="msg-guest">Guest</span>
                )}
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={6} className="msg-empty">No messages yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default MessagesAdmin
