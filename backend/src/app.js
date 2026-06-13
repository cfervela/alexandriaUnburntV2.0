const express = require('express')
const cors = require('cors')

const bookRoutes = require('./routes/bookRoutes')
const publicBookRoutes = require('./routes/publicBookRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const genreRoutes = require('./routes/genreRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/books', publicBookRoutes)
app.use('/bookadmin', bookRoutes)
app.use('/auth', authRoutes)
app.use('/usersadmin', userRoutes)
app.use('/genres', genreRoutes)

module.exports = app
