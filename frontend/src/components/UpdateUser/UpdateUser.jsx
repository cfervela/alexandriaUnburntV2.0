import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import apiClient from '../../services/apiClient'

const UpdateUser = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    

    useEffect(() => {
        apiClient.get(`/users/${id}`)
            .then(res => setUser(res.data))
            .catch(() => setError('Could not load user'))
    }, [id])

    const handleChange = (e) => {
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await apiClient.put(`/users/${id}`, user)
            navigate('/usersAdmin')
        } catch (err) {
            setError(err.response?.data?.message ?? 'Update failed')
        }
    }

    if (!user) return <p>Loading…</p>

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#2B3349', padding: '2rem' }}>
            <div className="Books">
                <h1 className="Title">Edit User</h1>
                <form className="update-form" onSubmit={handleSubmit}>
                    <label>Name
                        <input name="name" value={user.name} onChange={handleChange} required />
                    </label>
                    <label>Email
                        <input name="email" type="email" value={user.email} onChange={handleChange} required />
                    </label>

                    {user.role === 'client' && (
                        <>
                            <label>Address
                                <input name="Address" value={user.Address ?? ''} onChange={handleChange} />
                            </label>
                            <label>Phone
                                <input name="Phone" value={user.Phone ?? ''} onChange={handleChange} maxLength={10} />
                            </label>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <label>Permission level
                            <select name="permissionLevel" value={user.permissionLevel ?? ''} onChange={handleChange}>
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="manager">Manager</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </label>
                    )}

                    {error && <p className="field-error">{error}</p>}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn-save">Save changes</button>
                        <button type="button" className="btn-cancel" onClick={() => navigate('/usersAdmin')}>Cancel</button>    
                    </div>
                </form>
        </div>
        </div>
    )
}

export default UpdateUser