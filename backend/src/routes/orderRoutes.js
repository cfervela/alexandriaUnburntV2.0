const { Router } = require('express')
const orderController = require('../controllers/orderController')
const { authenticate } = require('../middleware/authMiddleware')

const router = Router()

router.post('/checkout', authenticate, orderController.checkout)

module.exports = router
