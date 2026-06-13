const db = require('../config/db')

exports.create = (req, res) => {
    const { name, email, subject, body, userId } = req.body

    if (!name || !email || !subject || !body) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const sentData = new Date().toISOString()
    const q = 'INSERT INTO Message (subject, message, sentData, UseruserId) VALUES (?, ?, ?, ?)'
    const user = userId ? parseInt(userId) : null

    db.query(q, [subject, body, sentData, user], (err, data) => {
        if (err) {
            console.error('DB Error:', err)
            return res.status(500).json({ message: err.sqlMessage })
        }
        return res.status(201).json({ message: 'Message sent successfully' })
    })
}

exports.getAll = (req, res) => {
    const q = `
        SELECT m.messageId, m.subject, m.message, m.sentData,
               m.UseruserId, u.name, u.email
        FROM Message m
        LEFT JOIN User u ON u.userId = m.UseruserId
        ORDER BY m.messageId DESC
    `
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })
        return res.json(data)
    })
}
