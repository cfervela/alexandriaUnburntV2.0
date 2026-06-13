import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router"
import "./Cart.css"

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <i className="bi bi-cart-x"></i>
          <h2>Your cart is empty</h2>
          <p>Explore our catalogue and add some books to get started.</p>
          <button className="btn browse-btn" onClick={() => navigate("/catalogue")}>
            Browse Catalogue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="btn clear-btn" onClick={clearCart}>
          <i className="bi bi-trash"></i> Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item.isbn}>
            <div className="cart-item-img">
              <img
                src={`https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg`}
                alt={item.title}
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "flex"
                }}
              />
              <div className="cover-placeholder" style={{ display: "none" }}>
                {item.title?.[0]}
              </div>
            </div>
            <div className="cart-item-info">
              <h3 className="cart-item-title">{item.title}</h3>
              <p className="cart-item-author">{item.author}</p>
              <p className="cart-item-price">${Number(item.price).toFixed(2)} each</p>
            </div>
            <div className="cart-item-quantity">
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.isbn, item.quantity - 1)}
              >
                <i className="bi bi-dash"></i>
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.isbn, item.quantity + 1)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.isbn)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-info">
          <span className="cart-summary-label">Total items:</span>
          <span className="cart-summary-value">{totalItems}</span>
        </div>
        <div className="cart-summary-info">
          <span className="cart-summary-label">Total:</span>
          <span className="cart-summary-price">${totalPrice.toFixed(2)}</span>
        </div>
        <button className="btn checkout-btn">
          <i className="bi bi-credit-card"></i> Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
