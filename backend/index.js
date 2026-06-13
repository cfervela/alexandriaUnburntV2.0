const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'AlexandriaUnburnt',
})

function connectWithRetry(retries = 10, delay = 3000) {
    db.connect((err) => {
        if (err) {
            console.error(`DB connection failed (${retries} retries left):`, err.code)
            if (retries > 0) {
                setTimeout(() => connectWithRetry(retries - 1, delay), delay)
            } else {
                console.error('DB connection exhausted retries, exiting')
                process.exit(1)
            }
            return
        }
        console.log('Connected to MySQL')
    })
}
connectWithRetry()


//returns all books to the admin view
app.get('/bookadmin', (req, res) => {
    const q = "SELECT * FROM Book";
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post('/bookadmin', (req, res) => {
    const { isbn, title, author, description, publisher, price, stock, genreID } = req.body;

    if (!isbn || !title || !author || !publisher || !price || !stock || !genreID) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const q = "INSERT INTO Book (`isbn`, `title`, `author`, `description`, `publisher`, `price`, `stock`, `genreID`) VALUES (?)";
    const values = [isbn, title, author, description, publisher, parseFloat(price), parseInt(stock), parseInt(genreID)];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("DB Error:", err)
            return res.status(500).json(err)
        }
        return res.status(201).json(data)
    });
});

app.delete('/bookadmin/:isbn', (req, res)=>{
    const bookId = req.params.isbn;
    const q = "DELETE from Book WHERE isbn = ?"

    db.query(q, [bookId], (err,data)=>{
        if (err) {
            console.error("DB Error:", err)
            return res.status(500).json(err)
        }
        return res.status(201).json(data)
    })
})

// GET single book
app.get('/bookadmin/:isbn', (req, res) => {
    const q = "SELECT * FROM Book WHERE isbn = ?"
    console.log("Searching for ISBN:", req.params.isbn)  // add this
    db.query(q, [req.params.isbn], (err, data) => {
        if (err) return res.status(500).json(err)
        console.log("Result:", data)
        return res.json(data[0])
    })
})

// PUT update book
app.put('/bookadmin/:isbn', (req, res) => {
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
})

app.post('/auth/register', (req, res) => {
    const { name, email, password, role, address, phone, permissionLevel } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    // Check if email already exists
    db.query('SELECT userId FROM User WHERE email = ?', [email], (err, rows) => {
        if (err) return res.status(500).json({ message: err.sqlMessage });
        if (rows.length > 0) return res.status(409).json({ message: 'Email already registered' });

        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ message: err.sqlMessage });

            // 1. Insert into User
            const userQ = 'INSERT INTO User (name, email, password) VALUES (?, ?, ?)';
            db.query(userQ, [name, email, password], (err, result) => {
                if (err) {
                    return db.rollback(() =>
                        res.status(500).json({ message: err.sqlMessage })
                    );
                }

                const newUserId = result.insertId;

                // 2. Insert into Client or Admin
                if (role === 'client') {
                    if (!address || !phone) {
                        return db.rollback(() =>
                            res.status(400).json({ message: 'Address and phone are required for clients' })
                        );
                    }
                    const clientQ = 'INSERT INTO Client (Address, Phone, UseruserId) VALUES (?, ?, ?)';
                    db.query(clientQ, [address, phone, newUserId], (err) => {
                        if (err) {
                            return db.rollback(() =>
                                res.status(500).json({ message: err.sqlMessage })
                            );
                        }
                        commitAndRespond(newUserId, name, email, role);
                    });

                } else if (role === 'admin') {
                    if (!permissionLevel) {
                        return db.rollback(() =>
                            res.status(400).json({ message: 'Permission level is required for admins' })
                        );
                    }
                    const adminQ = 'INSERT INTO Admin (permissionLevel, UseruserId) VALUES (?, ?)';
                    db.query(adminQ, [permissionLevel, newUserId], (err) => {
                        if (err) {
                            return db.rollback(() =>
                                res.status(500).json({ message: err.sqlMessage })
                            );
                        }
                        commitAndRespond(newUserId, name, email, role);
                    });

                } else {
                    return db.rollback(() =>
                        res.status(400).json({ message: 'Invalid role' })
                    );
                }
            });

            function commitAndRespond(userId, name, email, role) {
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() =>
                            res.status(500).json({ message: err.sqlMessage })
                        );
                    }
                    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
                    return res.status(201).json({
                        token,
                        user: { userId, name, email, role },
                    });
                });
            }
        });
    });
});

// GET all users with their role (client or admin)
app.get('/users', (req, res) => {
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
    `;
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage });
        return res.json(data);
    });
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: err.sqlMessage });

        db.query('DELETE FROM Admin WHERE UseruserId = ?', [id], (err) => {
            if (err) {
                console.error('DELETE Admin error:', err.sqlMessage);
                return db.rollback(() => res.status(500).json({ message: err.sqlMessage }));
            }

            db.query('DELETE FROM Client WHERE UseruserId = ?', [id], (err) => {
                if (err) {
                    console.error('DELETE Client error:', err.sqlMessage);
                    return db.rollback(() => res.status(500).json({ message: err.sqlMessage }));
                }

                db.query('DELETE FROM Message WHERE UseruserId = ?', [id], (err) => {
                    if (err) {
                        console.error('DELETE Message error:', err.sqlMessage);
                        return db.rollback(() => res.status(500).json({ message: err.sqlMessage }));
                    }

                    db.query('DELETE FROM User WHERE userId = ?', [id], (err) => {
                        if (err) {
                            console.error('DELETE User error:', err.sqlMessage);
                            return db.rollback(() => res.status(500).json({ message: err.sqlMessage }));
                        }

                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ message: err.sqlMessage }));
                            return res.json({ message: 'User deleted' });
                        });
                    });
                });
            });
        });
    });
});

app.get('/users/:id', (req, res) => {
    const q = `
        SELECT u.userId, u.name, u.email,
               CASE WHEN a.UseruserId IS NOT NULL THEN 'admin' ELSE 'client' END AS role,
               a.permissionLevel, c.Address, c.Phone
        FROM User u
        LEFT JOIN Admin a ON a.UseruserId = u.userId
        LEFT JOIN Client c ON c.UseruserId = u.userId
        WHERE u.userId = ?
    `;
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ message: err.sqlMessage });
        if (!data[0]) return res.status(404).json({ message: 'User not found' });
        return res.json(data[0]);
    });
});

app.put('/users/:id', (req, res) => {
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
})

app.listen(process.env.PORT || 8800, ()=>{
    console.log(`Backend ready at http://localhost:${process.env.PORT || 8800}`)
})