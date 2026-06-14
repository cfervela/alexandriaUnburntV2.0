const db = require('../config/db')

exports.checkout = (req, res) => {
    const { items, total } = req.body
    const userId = req.user.userId

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' })
    }

    // Validate stock before starting transaction
    const isbns = items.map(i => i.isbn)
    const stockQ = 'SELECT isbn, stock FROM Book WHERE isbn IN (?)'
    db.query(stockQ, [isbns], (err, books) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })

        const stockMap = {}
        books.forEach(b => { stockMap[b.isbn] = b.stock })

        for (const item of items) {
            const available = stockMap[item.isbn]
            if (available === undefined) {
                return res.status(404).json({ message: `Book ${item.isbn} not found` })
            }
            if (available < item.quantity) {
                return res.status(409).json({
                    message: `Insufficient stock for "${item.title || item.isbn}". Available: ${available}, requested: ${item.quantity}`
                })
            }
        }

        // All stock checks passed — begin transaction
        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ message: err.sqlMessage })

            const orderDate = new Date().toISOString()
            const orderQ = 'INSERT INTO `BookOrder` (userId, orderDate, total) VALUES (?, ?, ?)'

            db.query(orderQ, [userId, orderDate, total], (err, orderResult) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                }

                const orderId = orderResult.insertId
                let completed = 0
                let failed = false

                // Insert each OrderItem and update stock
                for (const item of items) {
                    const itemQ = 'INSERT INTO OrderItem (orderId, isbn, quantity, price) VALUES (?, ?, ?, ?)'
                    db.query(itemQ, [orderId, item.isbn, item.quantity, item.price], (err) => {
                        if (err && !failed) {
                            failed = true
                            return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                        }

                        // Deduct stock
                        const deductQ = 'UPDATE Book SET stock = stock - ? WHERE isbn = ? AND stock >= ?'
                        db.query(deductQ, [item.quantity, item.isbn, item.quantity], (err, result) => {
                            if (err && !failed) {
                                failed = true
                                return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                            }

                            completed++
                            if (completed === items.length && !failed) {
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                                    }
                                    return res.status(201).json({
                                        message: 'Order placed successfully',
                                        orderId,
                                    })
                                })
                            }
                        })
                    })
                }
            })
        })
    })
}
