import './BooksAdmin.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

const BooksAdmin = () => {
    const [books, setBooks] = useState([])
    const navigate = useNavigate()

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

    const handleDelete = async (id)=>{
        try{
            await axios.delete("http://localhost:8800/bookadmin/"+id)
            window.location.reload()
        }catch(err){
            console.log(err)
        }
    }

    const [currentPage, setCurrentPage] = useState(1)
    const booksPerPage = 8

    const totalPages = Math.ceil(books.length / booksPerPage)
    const paginatedBooks = books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)

    return (
        <div className="Books">
            <h1>Books</h1>
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
        </div>
    )
}

export default BooksAdmin