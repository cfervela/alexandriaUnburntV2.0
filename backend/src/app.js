const express = require('express')
const cors = require('cors')

const bookRoutes = require('./routes/bookRoutes')
const publicBookRoutes = require('./routes/publicBookRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const genreRoutes = require('./routes/genreRoutes')
const messageRoutes = require('./routes/messageRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/books', publicBookRoutes)
app.use('/bookadmin', bookRoutes)
app.use('/auth', authRoutes)
app.use('/usersadmin', userRoutes)
app.use('/genres', genreRoutes)
app.use('/messages', messageRoutes)
app.use('/orders', orderRoutes)

// Servir el frontend estático
const path = require('path')
const frontendDist = path.join(__dirname, '../../frontend/dist')

app.use(express.static(frontendDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

module.exports = app
