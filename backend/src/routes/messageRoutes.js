const { Router } = require('express')
const messageController = require('../controllers/messageController')
const { authenticate, requireRole } = require('../middleware/authMiddleware')

const router = Router()

// Public: anyone can submit a contact message
router.post('/', messageController.create)

// Admin-only routes
router.get('/', authenticate, requireRole('admin'), messageController.getAll)
router.delete('/:id', authenticate, requireRole('admin'), messageController.remove)

module.exports = router
