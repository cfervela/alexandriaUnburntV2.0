const db = require('../config/db')

exports.getAll = (req, res) => {
    db.query('SELECT * FROM Genre', (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })
        return res.json(data)
    })
}
