import './BooksAdmin.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Outlet } from "react-router"


const BooksAdmin = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const handleUpdateSuccess = (msg) => {
        setSuccessMsg(msg)
        setTimeout(() => setSuccessMsg(''), 3000)
    }


    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/bookadmin")
                setBooks(Array.isArray(res.data) ? res.data : [])
            } catch(err) {
                console.log(err)
            }
        }
        fetchAllBooks()
    }, [])

    const handleDelete = async (id) => {
        setErrorMsg('')
        setSuccessMsg('')
        setLoading(true)
        try {
            await axios.delete("http://localhost:8800/bookadmin/" + id)
            setBooks(prev => prev.filter(b => b.isbn !== id))
            setSuccessMsg('Book deleted successfully.')
            setTimeout(() => setSuccessMsg(''), 3000)
        } catch (err) {
            setErrorMsg('Failed to delete book. Please try again.')
            setTimeout(() => setErrorMsg(''), 3000)
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const [currentPage, setCurrentPage] = useState(1)
    const booksPerPage = 8

    const totalPages = Math.ceil(books.length / booksPerPage)
    const paginatedBooks = books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)

    return (
        <div className="Books">
            <h1 className='Title' >Current Stock</h1>
            {successMsg && (
                <div className="alert-success">
                    <i className="bi bi-check-circle me-2"></i>{successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="alert-error">
                    <i className="bi bi-exclamation-circle me-2"></i>{errorMsg}
                </div>
            )}
            {loading && (
                <div className="alert-loading">
                    <i className="bi bi-hourglass-split me-2"></i>Processing…
                </div>
            )}
            <table className="book-table">
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Genre</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedBooks.map(book => (
                        <tr key={book.isbn}>
                            <td>{book.isbn}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.genreID}</td>
                            <td>{book.stock}</td>
                            <td>${book.price}</td>
                            <td>
                                <button className="edit-btn" onClick={() => navigate(`/booksAdmin/updateBook/${book.isbn}`)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="delete-btn ms-4" onClick={() => handleDelete(book.isbn)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                >
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
                <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            <button className="add-btn" onClick={() => navigate('/booksAdmin/addBook')}>
                <i className="bi bi-plus-circle"></i>
            </button>
            <Outlet context={{ onSuccess: handleUpdateSuccess }} />
        </div>
    )
}

export default BooksAdmin