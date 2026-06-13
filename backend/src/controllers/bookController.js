const db = require('../config/db')

exports.getAll = (req, res) => {
    const q = "SELECT * FROM Book"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
}

exports.create = (req, res) => {
    const { isbn, title, author, description, publisher, price, stock, genreID } = req.body

    if (!isbn || !title || !author || !publisher || !price || !stock || !genreID) {
        return res.status(400).json({ error: "All fields are required" })
    }

    const q = "INSERT INTO Book (`isbn`, `title`, `author`, `description`, `publisher`, `price`, `stock`, `genreID`) VALUES (?)"
    const values = [isbn, title, author, description, publisher, parseFloat(price), parseInt(stock), parseInt(genreID)]

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("DB Error:", err)
            return res.status(500).json(err)
        }
        return res.status(201).json(data)
    })
}

exports.remove = (req, res) => {
    const bookId = req.params.isbn
    const q = "DELETE from Book WHERE isbn = ?"

    db.query(q, [bookId], (err, data) => {
        if (err) {
            console.error("DB Error:", err)
            return res.status(500).json(err)
        }
        return res.status(201).json(data)
    })
}

exports.getOne = (req, res) => {
    const q = "SELECT * FROM Book WHERE isbn = ?"
    console.log("Searching for ISBN:", req.params.isbn)
    db.query(q, [req.params.isbn], (err, data) => {
        if (err) return res.status(500).json(err)
        console.log("Result:", data)
        return res.json(data[0])
    })
}

exports.update = (req, res) => {
    const { title, author, description, publisher, price, stock, genreID } = req.body
    const q = "UPDATE Book SET title=?, author=?, description=?, publisher=?, price=?, stock=?, genreID=? WHERE isbn=?"
    const values = [title, author, description, publisher, parseFloat(price), parseInt(stock), parseInt(genreID), req.params.isbn]
    db.query(q, values, (err, data) => {
        if (err) {
            console.error("DB Error:", err)
            return res.status(500).json(err)
        }
        return res.json(data)
    })
}
