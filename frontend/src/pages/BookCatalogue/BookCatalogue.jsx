import './BooksCatalogue.css'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useCart } from '../../context/CartContext'
import apiClient from '../../services/apiClient'
import BookCard from '../../components/BookCard/BookCard'

const genreMap = {
    1: 'Classic',
    2: 'Fantasy',
    3: 'Romance',
    4: 'Contemporary',
    5: 'History',
    6: 'YA',
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
            } catch (err) {
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
                        <BookCard
                            key={book.isbn}
                            book={{ ...book, genreName: genreMap[book.genreID] || 'Unknown' }}
                            variant="catalogue"
                            onNavigate={(isbn) => navigate(`/catalogue/${isbn}`)}
                            onAddToCart={addToCart}
                            showGenre
                            showDescription
                            showInfoButton
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default BooksCatalogue