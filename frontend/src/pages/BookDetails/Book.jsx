import './Book.css'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useCart } from '../../context/CartContext'
import apiClient from '../../services/apiClient'

const genreMap = {
    1: 'Classic', 2: 'Fantasy', 3: 'Romance',
    4: 'Contemporary', 5: 'History', 6: 'YA',
}

const getGenreClass = (genreID) => (genreMap[genreID] || '').toLowerCase()

const BookDetail = () => {
    const { isbn } = useParams()
    const navigate = useNavigate()
    const { addToCart, items } = useCart()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [addedMsg, setAddedMsg] = useState(false)

    const isInCart = items.some((item) => item.isbn === book?.isbn)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await apiClient.get(`/books/${isbn}`)
                setBook(res.data)
            } catch {
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [isbn])

    return (
        <div className="book container mt-5">
            {loading && <p>Loading book details...</p>}
            {error && <p className="text-danger">Failed to load book. Please try again.</p>}

            {!loading && book && (
                <div className="row g-4">
                    <div className="col-md-4 text-center">
                        {!imgError ? (
                            <img
                                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                                alt={book.title}
                                onError={() => setImgError(true)}
                                className="img-fluid rounded shadow"
                            />
                        ) : (
                            <div className="cover-placeholder">{book.title?.[0]}</div>
                        )}
                    </div>
                    <div className="col-md-8">
                        <h1 className="mb-1">{book.title}</h1>
                        <h4 className="text-muted mb-3">{book.author}</h4>
                        <span className={`book-genre genre-${getGenreClass(book.genreID)} mb-3 d-inline-block`}>
                            {genreMap[book.genreID] || 'Unknown'}
                        </span>
                        <p className="mb-3">{book.description}</p>
                        <hr />
                        <p><strong>Publisher:</strong> {book.publisher}</p>
                        <p><strong>ISBN:</strong> {book.isbn}</p>
                        <p><strong>Price:</strong> ${book.price}</p>
                        <p><strong>Stock:</strong> {book.stock} available</p>
                        <button
                            className="btn cart"
                            onClick={() => {
                                addToCart(book)
                                setAddedMsg(true)
                                setTimeout(() => setAddedMsg(false), 2000)
                            }}
                        >
                            <i className="bi bi-cart-plus" style={{marginRight: '10px'}}></i>
                            {isInCart ? 'Add one more' : 'Agregar al carrito'}
                        </button>
                        {addedMsg && (
                            <span className="cart-added-msg">
                                <i className="bi bi-check-circle"></i> Added to cart!
                            </span>
                        )}
                    </div>
                </div>
            )}

            <button className="fab-btn" onClick={() => navigate('/catalogue')}>
                <i className="bi bi-arrow-left-circle"></i>
            </button>
        </div>
    )
}

export default BookDetail