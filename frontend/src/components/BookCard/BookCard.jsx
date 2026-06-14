import PropTypes from "prop-types"

const BookCard = ({
  book,
  onNavigate,
  onAddToCart,
  variant,
  showGenre,
  showDescription,
  showInfoButton,
}) => {
  const cardClass = variant === "featured" ? "featured-card" : "book-card"
  const coverClass = variant === "featured" ? "featured-cover" : "book-cover"
  const titleClass = variant === "featured" ? "featured-title" : "book-title"
  const authorClass = variant === "featured" ? "featured-author" : "book-author"
  const coverSize = variant === "featured" ? "M" : "L"

  return (
    <div className={cardClass} onClick={() => onNavigate(book.isbn)}>
      <div className={coverClass}>
        <img
          src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-${coverSize}.jpg`}
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

      <h3 className={titleClass}>{book.title}</h3>
      <p className={authorClass}>{book.author}</p>

      {showGenre && (
        <span className={`book-genre genre-${(book.genreName || "default").toLowerCase()}`}>
          {book.genreName || "Unknown"}
        </span>
      )}

      {showDescription && (
        <p className="book-description">{book.description}</p>
      )}

      <div className={variant === "featured" ? "featured-footer" : "book-meta"}>
        <span className={variant === "featured" ? "featured-price" : "book-price"}>
          ${Number(book.price).toFixed(2)}
        </span>

        {showInfoButton && (
          <button
            className="btn-info"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(book.isbn)
            }}
          >
            <i className="bi bi-zoom-in"></i> Info
          </button>
        )}

        <button
          className={variant === "featured" ? "btn-cart-add-sm" : "btn-cart-add"}
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(book)
          }}
        >
          <i className="bi bi-cart-plus"></i>
        </button>
      </div>
    </div>
  )
}

BookCard.propTypes = {
  book: PropTypes.shape({
    isbn: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    genreName: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
  onNavigate: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["featured", "catalogue"]).isRequired,
  showGenre: PropTypes.bool,
  showDescription: PropTypes.bool,
  showInfoButton: PropTypes.bool,
}

export default BookCard
