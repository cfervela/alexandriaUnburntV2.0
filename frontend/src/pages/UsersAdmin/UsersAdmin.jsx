import './UsersAdmin.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
//import { useNavigate } from 'react-router'

const UsersAdmin = () => {
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [editUser, setEditUser] = useState(null)   // null = closed
    const [serverError, setServerError] = useState('')
    //const navigate = useNavigate()

    // ── Guard ──
    /*useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) { navigate('/'); return }
        const user = JSON.parse(stored)
        if (user.role !== 'admin' || user.permissionLevel !== 'superadmin') navigate('/')
    }, [navigate])*/

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8800/users')
                setUsers(Array.isArray(res.data) ? res.data : [])
            } catch (err) { console.log(err) }
        }
        fetchUsers()
    }, [])

    // ── Delete ──
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8800/users/${id}`)
            setUsers(users.filter(u => u.userId !== id))
        } catch (err) { console.log(err) }
    }

    // ── Edit modal ──
    const openEdit = (user) => { setEditUser({ ...user }); setServerError('') }
    const closeEdit = () => { setEditUser(null); setServerError('') }

    const handleEditChange = (e) =>
        setEditUser(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setServerError('')
        try {
            await axios.put(`http://localhost:8800/users/${editUser.userId}`, editUser)
            // Update local state directly instead of refetching
            setUsers(prev => prev.map(u => u.userId === editUser.userId ? editUser : u))
            closeEdit()
        } catch (err) {
            setServerError(err.response?.data?.message ?? 'Update failed')
        }
    }

    // ── Pagination ──
    const usersPerPage = 8
    const totalPages = Math.ceil(users.length / usersPerPage)
    const paginatedUsers = users.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    )

    return (
        <div className="Books">
            <h1>Users</h1>

            <table className="book-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Details</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`role-badge role-badge--${user.role}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="details-cell">
                                {user.role === 'admin'
                                    ? user.permissionLevel
                                    : `${user.Phone ?? '—'}  ·  ${user.Address ?? '—'}`}
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => openEdit(user)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="delete-btn ms-4" onClick={() => handleDelete(user.userId)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button className="page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button className="page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            {/* ── Edit Modal ── */}
            {editUser && (
                <div className="modal-overlay" onClick={closeEdit}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit user</h2>
                            <button className="modal-close" onClick={closeEdit}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="modal-form">
                            <label>Name
                                <input name="name" value={editUser.name} onChange={handleEditChange} required />
                            </label>
                            <label>Email
                                <input name="email" type="email" value={editUser.email} onChange={handleEditChange} required />
                            </label>

                            {editUser.role === 'client' && (
                                <>
                                    <label>Address
                                        <input name="Address" value={editUser.Address ?? ''} onChange={handleEditChange} />
                                    </label>
                                    <label>Phone
                                        <input name="Phone" value={editUser.Phone ?? ''} onChange={handleEditChange} maxLength={10} />
                                    </label>
                                </>
                            )}

                            {editUser.role === 'admin' && (
                                <label>Permission level
                                    <select name="permissionLevel" value={editUser.permissionLevel ?? ''} onChange={handleEditChange}>
                                        <option value="viewer">Viewer</option>
                                        <option value="editor">Editor</option>
                                        <option value="manager">Manager</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                </label>
                            )}

                            {serverError && <p className="field-error">{serverError}</p>}

                            <div className="modal-actions">
                                <button type="button" className="delete-btn" onClick={closeEdit}>Cancel</button>
                                <button type="submit" className="edit-btn">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default UsersAdmin