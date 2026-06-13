const db = require('../config/db')

exports.getAll = (req, res) => {
    const q = `
        SELECT u.userId, u.name, u.email,
               CASE 
                 WHEN a.UseruserId IS NOT NULL THEN 'admin'
                 ELSE 'client'
               END AS role,
               a.permissionLevel,
               c.Address, c.Phone
        FROM User u
        LEFT JOIN Admin a ON a.UseruserId = u.userId
        LEFT JOIN Client c ON c.UseruserId = u.userId
    `
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })
        return res.json(data)
    })
}

exports.remove = (req, res) => {
    const id = req.params.id

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })

        db.query('DELETE FROM Admin WHERE UseruserId = ?', [id], (err) => {
            if (err) {
                console.error('DELETE Admin error:', err.sqlMessage)
                return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
            }

            db.query('DELETE FROM Client WHERE UseruserId = ?', [id], (err) => {
                if (err) {
                    console.error('DELETE Client error:', err.sqlMessage)
                    return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                }

                db.query('DELETE FROM Message WHERE UseruserId = ?', [id], (err) => {
                    if (err) {
                        console.error('DELETE Message error:', err.sqlMessage)
                        return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                    }

                    db.query('DELETE FROM User WHERE userId = ?', [id], (err) => {
                        if (err) {
                            console.error('DELETE User error:', err.sqlMessage)
                            return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                        }

                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                            return res.json({ message: 'User deleted' })
                        })
                    })
                })
            })
        })
    })
}

exports.getOne = (req, res) => {
    const q = `
        SELECT u.userId, u.name, u.email,
               CASE WHEN a.UseruserId IS NOT NULL THEN 'admin' ELSE 'client' END AS role,
               a.permissionLevel, c.Address, c.Phone
        FROM User u
        LEFT JOIN Admin a ON a.UseruserId = u.userId
        LEFT JOIN Client c ON c.UseruserId = u.userId
        WHERE u.userId = ?
    `
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })
        if (!data[0]) return res.status(404).json({ message: 'User not found' })
        return res.json(data[0])
    })
}

exports.update = (req, res) => {
    const { name, email, role, Address, Phone, permissionLevel } = req.body
    const id = req.params.id

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })

        db.query('UPDATE User SET name=?, email=? WHERE userId=?', [name, email, id], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))

            if (role === 'client') {
                db.query(
                    'UPDATE Client SET Address=?, Phone=? WHERE UseruserId=?',
                    [Address, Phone, id],
                    (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                            return res.json({ message: 'User updated' })
                        })
                    }
                )
            } else if (role === 'admin') {
                db.query(
                    'UPDATE Admin SET permissionLevel=? WHERE UseruserId=?',
                    [permissionLevel, id],
                    (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }))
                            return res.json({ message: 'User updated' })
                        })
                    }
                )
            }
        })
    })
}
