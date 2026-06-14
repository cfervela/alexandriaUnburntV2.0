const { Router } = require('express')
const userController = require('../controllers/userController')
const { authenticate, requireRole } = require('../middleware/authMiddleware')

const router = Router()

router.use(authenticate)
router.use(requireRole('admin'))

router.get('/', userController.getAll)
router.get('/:id', userController.getOne)
router.put('/:id', userController.update)
router.delete('/:id', userController.remove)

module.exports = router
