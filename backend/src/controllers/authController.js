const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h'

function generateToken(user) {
    return jwt.sign(
        {
            userId: user.userId,
            role: user.role,
            permissionLevel: user.permissionLevel || null,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )
}

exports.register = (req, res) => {
    const { name, email, password, role, address, phone, permissionLevel } = req.body

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password and role are required' })
    }

    db.query('SELECT userId FROM User WHERE email = ?', [email], async (err, rows) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })
        if (rows.length > 0) return res.status(409).json({ message: 'Email already registered' })

        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (hashErr) {
            return res.status(500).json({ message: 'Error hashing password' })
        }

        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ message: err.sqlMessage })

            const userQ = 'INSERT INTO User (name, email, password) VALUES (?, ?, ?)'
            db.query(userQ, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    return db.rollback(() =>
                        res.status(500).json({ message: err.sqlMessage })
                    )
                }

                const newUserId = result.insertId

                if (role === 'client') {
                    if (!address || !phone) {
                        return db.rollback(() =>
                            res.status(400).json({ message: 'Address and phone are required for clients' })
                        )
                    }
                    const clientQ = 'INSERT INTO Client (Address, Phone, UseruserId) VALUES (?, ?, ?)'
                    db.query(clientQ, [address, phone, newUserId], (err) => {
                        if (err) {
                            return db.rollback(() =>
                                res.status(500).json({ message: err.sqlMessage })
                            )
                        }
                        commitAndRespond(newUserId, name, email, role, null)
                    })

                } else if (role === 'admin') {
                    if (!permissionLevel) {
                        return db.rollback(() =>
                            res.status(400).json({ message: 'Permission level is required for admins' })
                        )
                    }
                    const adminQ = 'INSERT INTO Admin (permissionLevel, UseruserId) VALUES (?, ?)'
                    db.query(adminQ, [permissionLevel, newUserId], (err) => {
                        if (err) {
                            return db.rollback(() =>
                                res.status(500).json({ message: err.sqlMessage })
                            )
                        }
                        commitAndRespond(newUserId, name, email, role, permissionLevel)
                    })

                } else {
                    return db.rollback(() =>
                        res.status(400).json({ message: 'Invalid role' })
                    )
                }
            })

            function commitAndRespond(userId, name, email, role, permissionLevel) {
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() =>
                            res.status(500).json({ message: err.sqlMessage })
                        )
                    }
                    const user = { userId, name, email, role, permissionLevel }
                    const token = generateToken(user)
                    return res.status(201).json({ token, user })
                })
            }
        })
    })
}

exports.login = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    const q = `
        SELECT u.userId, u.name, u.email, u.password AS hashedPassword,
               CASE WHEN a.UseruserId IS NOT NULL THEN 'admin' ELSE 'client' END AS role,
               a.permissionLevel
        FROM User u
        LEFT JOIN Admin a ON a.UseruserId = u.userId
        LEFT JOIN Client c ON c.UseruserId = u.userId
        WHERE u.email = ?
    `
    db.query(q, [email], async (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage })
        if (!data[0]) return res.status(401).json({ message: 'Invalid email or password' })

        const user = data[0]

        try {
            const match = await bcrypt.compare(password, user.hashedPassword)
            if (!match) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }
        } catch (compareErr) {
            return res.status(500).json({ message: 'Error verifying password' })
        }

        const token = generateToken(user)
        return res.json({
            token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                permissionLevel: user.permissionLevel,
            },
        })
    })
}
