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
    const maxStock = book.stock || 999
    setItems((prev) => {
      const existing = prev.find((item) => item.isbn === book.isbn)
      if (existing) {
        if (existing.quantity >= maxStock) return prev
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
      prev.map((item) => {
        if (item.isbn !== isbn) return item
        const maxQty = item.stock || 999
        return { ...item, quantity: Math.min(quantity, maxQty) }
      })
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
