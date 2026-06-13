const app = require('./app')
const db = require('./config/db')

const PORT = process.env.PORT || 8800

app.listen(PORT, () => {
    console.log(`Backend ready at http://localhost:${PORT}`)
})
