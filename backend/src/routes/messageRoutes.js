const { Router } = require('express')
const messageController = require('../controllers/messageController')

const router = Router()

router.post('/', messageController.create)
router.get('/', messageController.getAll)
router.delete('/:id', messageController.remove)

module.exports = router
