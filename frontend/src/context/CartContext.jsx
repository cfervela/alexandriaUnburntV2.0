import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (book) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.isbn === book.isbn)
      if (existing) {
        return prev.map((item) =>
          item.isbn === book.isbn
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (isbn) => {
    setItems((prev) => prev.filter((item) => item.isbn !== isbn))
  }

  const updateQuantity = (isbn, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.isbn === isbn ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
