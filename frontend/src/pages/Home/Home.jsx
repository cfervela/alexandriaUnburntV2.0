import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useCart } from "../../context/CartContext"
import apiClient from "../../services/apiClient"
import "./Home.css"

const genreIcons = {
  Classic: "bi bi-book",
  Fantasy: "bi bi-stars",
  Romance: "bi bi-heart",
  YA: "bi bi-rocket-takeoff",
  History: "bi bi-bank",
  Cotemporary: "bi bi-globe2",
  Contemporary: "bi bi-globe2",
}

const Home = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get("/books"),
      apiClient.get("/genres"),
    ]).then(([bookRes, genreRes]) => {
      setBooks(bookRes.data)
      setGenres(genreRes.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const featured = useMemo(() => {
    const shuffled = [...books].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 8)
  }, [books])

  const booksByGenre = useMemo(() => {
    const map = {}
    books.forEach((book) => {
      if (!map[book.genreID]) map[book.genreID] = []
      map[book.genreID].push(book)
    })
    return map
  }, [books])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(search.trim())}`)
    }
  }

  if (loading) {
    return <div className="home-loading">Loading...</div>
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Alexandria Unburnt</h1>
          <p>Discover your next great read among our curated collection</p>
          <button className="btn hero-btn" onClick={() => navigate("/catalogue")}>
            Browse Catalogue
          </button>
        </div>
      </section>

      <section className="home-search">
        <form onSubmit={handleSearch}>
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </section>

      <section className="home-genres">
        <h2>Browse by Genre</h2>
        <div className="genre-grid">
          {genres.map((genre) => {
            const genreBooks = booksByGenre[genre.genreID] || []
            const coverBook = genreBooks[0]
            const genreName = genre.Type === "Cotemporary" ? "Contemporary" : genre.Type

            return (
              <div
                key={genre.genreID}
                className="genre-card"
                style={
                  coverBook
                    ? { backgroundImage: `url(https://covers.openlibrary.org/b/isbn/${coverBook.isbn}-M.jpg)` }
                    : {}
                }
                onClick={() => navigate(`/catalogue?genre=${genre.genreID}`)}
              >
                <div className="genre-card-overlay">
                  <span className="genre-icon">
                    <i className={genreIcons[genre.Type] || "bi bi-collection"}></i>
                  </span>
                  <span className="genre-label">{genreName}</span>
                  <span className="genre-count">{genreBooks.length} books</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="home-featured">
        <h2>Featured Books</h2>
        <div className="featured-grid">
          {featured.map((book) => (
            <div
              key={book.isbn}
              className="featured-card"
              onClick={() => navigate(`/catalogue/${book.isbn}`)}
            >
              <div className="featured-cover">
                <img
                  src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
                <div className="cover-placeholder" style={{ display: "none" }}>
                  {book.title?.[0]}
                </div>
              </div>
              <h3 className="featured-title">{book.title}</h3>
              <p className="featured-author">{book.author}</p>
              <div className="featured-footer">
                <span className="featured-price">${Number(book.price).toFixed(2)}</span>
                <button
                  className="btn-cart-add-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(book)
                  }}
                >
                  <i className="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {genres.map((genre) => {
        const genreBooks = booksByGenre[genre.genreID]
        if (!genreBooks || genreBooks.length === 0) return null

        return (
          <section key={genre.genreID} className="home-genre-row">
            <h2>{genre.Type === "Cotemporary" ? "Contemporary" : genre.Type}</h2>
            <div className="featured-grid">
              {genreBooks.map((book) => (
                <div
                  key={book.isbn}
                  className="featured-card"
                  onClick={() => navigate(`/catalogue/${book.isbn}`)}
                >
                  <div className="featured-cover">
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                      alt={book.title}
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                    <div className="cover-placeholder" style={{ display: "none" }}>
                      {book.title?.[0]}
                    </div>
                  </div>
                  <h3 className="featured-title">{book.title}</h3>
                  <p className="featured-author">{book.author}</p>
                  <div className="featured-footer">
                    <span className="featured-price">${Number(book.price).toFixed(2)}</span>
                    <button
                      className="btn-cart-add-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(book)
                      }}
                    >
                      <i className="bi bi-cart-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default Home
