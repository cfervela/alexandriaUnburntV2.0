const express = require('express')
const cors = require('cors')

const bookRoutes = require('./routes/bookRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/bookadmin', bookRoutes)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)

module.exports = app
