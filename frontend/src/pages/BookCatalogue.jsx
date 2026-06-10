import './BooksCatalogue.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

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
    const [selectedGenre, setSelectedGenre] = useState('all')
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

    const filteredBooks = selectedGenre === 'all'
        ? books
        : books.filter(book => genreMap[book.genreID] === selectedGenre)

    return (
        <div className="container mt-5 py-5">
            <div className="genre-filters">
                {['all', 'Classic', 'Fantasy', 'Contemporary', 'History', 'Romance', 'YA'].map(genre => (
                    <button
                        key={genre}
                        className={`btn btn-genre ${genre.toLowerCase()} ${selectedGenre === genre ? 'active' : ''}`}
                        onClick={() => setSelectedGenre(genre)}
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