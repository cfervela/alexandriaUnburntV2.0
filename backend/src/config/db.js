const mysql = require('mysql2')

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

module.exports = db
