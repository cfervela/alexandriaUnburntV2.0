import { useState, useEffect } from "react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router"
import apiClient from "../../services/apiClient"
import "./Cart.css"

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [checkingOut, setCheckingOut] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (items.length === 0) {
      setPreview(null)
      return
    }

    let ignore = false

    const payload = items.map(item => ({
      isbn: item.isbn,
      title: item.title,
      author: item.author,
      quantity: item.quantity,
      price: item.price,
    }))

    apiClient.post("/orders/preview", { items: payload })
      .then(res => { if (!ignore) setPreview(res.data) })
      .catch(() => { if (!ignore) setPreview(null) })

    return () => { ignore = true }
  }, [items])

  const previewItems = preview?.items || items
  const total = preview?.total ?? 0

  const handleCheckout = async () => {
    setCheckingOut(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const checkoutItems = items.map(item => ({
        isbn: item.isbn,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      }))

      const res = await apiClient.post("/orders/checkout", {
        items: checkoutItems,
      })

      setSuccessMsg(res.data.message || "Order placed successfully!")
      clearCart()
      setTimeout(() => setSuccessMsg(""), 5000)
    } catch (err) {
      const msg = err.response?.data?.message || "Checkout failed. Please try again."
      setErrorMsg(msg)
      setTimeout(() => setErrorMsg(""), 5000)
    } finally {
      setCheckingOut(false)
    }
  }

  if (items.length === 0 && !successMsg) {
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
        {items.length > 0 && (
          <button className="btn clear-btn" onClick={clearCart}>
            <i className="bi bi-trash"></i> Clear Cart
          </button>
        )}
      </div>

      {successMsg && (
        <div className="cart-success">
          <i className="bi bi-check-circle-fill"></i> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="cart-error">
          <i className="bi bi-exclamation-circle-fill"></i> {errorMsg}
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="cart-items">
            {previewItems.map((item) => (
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
                  <p className="cart-item-price">
                    ${(item.discount ?? item.price).toFixed(2)} each
                  </p>
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
                    className={`qty-btn ${item.quantity >= (item.stock || 999) ? "qty-btn-disabled" : ""}`}
                    onClick={() => updateQuantity(item.isbn, item.quantity + 1)}
                    disabled={item.quantity >= (item.stock || 999)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  ${((item.discount ?? item.price) * item.quantity).toFixed(2)}
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
              <span className="cart-summary-price">${total.toFixed(2)}</span>
            </div>
            {isAuthenticated ? (
              <button
                className="btn checkout-btn"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <>
                    <i className="bi bi-hourglass-split"></i> Processing…
                  </>
                ) : (
                  <>
                    <i className="bi bi-credit-card"></i> Proceed to Checkout
                  </>
                )}
              </button>
            ) : (
              <button className="btn checkout-btn" onClick={() => navigate("/login")}>
                <i className="bi bi-box-arrow-in-right"></i> Login to Checkout
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
