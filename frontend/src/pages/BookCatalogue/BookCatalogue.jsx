import './BooksCatalogue.css'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useCart } from '../../context/CartContext'
import apiClient from '../../services/apiClient'

const genreMap = {
    1: 'Classic',
    2: 'Fantasy',
    3: 'Romance',
    4: 'Contemporary',
    5: 'History',
    6: 'YA',
}

const getGenreClass = (genreID) => {
    const genre = genreMap[genreID] || ''
    return genre.toLowerCase()
}

const BooksCatalogue = () => {
    const [books, setBooks] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchText, setSearchText] = useState(searchParams.get('q') || '')
    const selectedGenre = searchParams.get('genre') === 'all' || !searchParams.get('genre')
        ? 'all'
        : genreMap[searchParams.get('genre')] || 'all'
    const navigate = useNavigate()
    const { addToCart, items } = useCart()

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await apiClient.get("/books")
                setBooks(Array.isArray(res.data) ? res.data : [])
            } catch(err) {
                console.log(err)
            }
        }
        fetchAllBooks()
    }, [])

    const filteredBooks = books.filter(book => {
        const matchesGenre = selectedGenre === 'all' || genreMap[book.genreID] === selectedGenre
        const query = searchParams.get('q')
        const matchesSearch = !query
            || book.title.toLowerCase().includes(query.toLowerCase())
            || book.author.toLowerCase().includes(query.toLowerCase())
        return matchesGenre && matchesSearch
    })

    const handleGenreClick = (genre) => {
        const params = new URLSearchParams(searchParams)
        if (genre === 'all') {
            params.delete('genre')
        } else {
            const genreId = Object.keys(genreMap).find(id => genreMap[id] === genre)
            params.set('genre', genreId)
        }
        setSearchParams(params)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        if (searchText.trim()) {
            params.set('q', searchText.trim())
        } else {
            params.delete('q')
        }
        setSearchParams(params)
    }

    return (
        <div className="container">
            <form className="catalogue-search" onSubmit={handleSearchSubmit}>
                <i className="bi bi-search"></i>
                <input
                    type="text"
                    placeholder="Search by title, author, or keyword..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </form>

            <div className="genre-filters">
                {['all', 'Classic', 'Fantasy', 'Contemporary', 'History', 'Romance', 'YA'].map(genre => (
                    <button
                        key={genre}
                        className={`btn btn-genre ${genre.toLowerCase()} ${selectedGenre === genre ? 'active' : ''}`}
                        onClick={() => handleGenreClick(genre)}
                    >
                        {genre === 'all' ? 'All' : genre}
                    </button>
                ))}
            </div>

            <div className="books-grid">
                {filteredBooks.length === 0 ? (
                    <div className="empty-state">
                        <i className="bi bi-book"></i>
                        <p>No books found.</p>
                    </div>
                ) : (
                    filteredBooks.map(book => (
                        <div className="book-card" key={book.isbn}>
                            <div className="book-cover">
                                <img
                                    src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                                    alt={book.title}
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                />
                                <div className="cover-placeholder" style={{display: 'none'}}>
                                    {book.title?.[0]}
                                </div>
                            </div>
                            <div className="book-info">
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">{book.author}</p>
                                <span className={`book-genre genre-${getGenreClass(book.genreID)}`}>
                                    {genreMap[book.genreID] || 'Unknown'}
                                </span>
                                <p className="book-description">{book.description}</p>
                                <div className="book-meta">
                                    <span className="book-price me-4">${book.price}</span>
                                    <button className="btn-info" onClick={() => navigate(`/catalogue/${book.isbn}`)}>
                                        <i className="bi bi-zoom-in"></i> Info
                                    </button>
                                    <button className="btn-cart-add" onClick={() => addToCart(book)}>
                                        <i className="bi bi-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default BooksCatalogue