const { Router } = require('express')
const bookController = require('../controllers/bookController')
const { authenticate, requireRole } = require('../middleware/authMiddleware')

const router = Router()

router.use(authenticate)
router.use(requireRole('admin'))

router.get('/', bookController.getAll)
router.post('/', bookController.create)
router.get('/:isbn', bookController.getOne)
router.put('/:isbn', bookController.update)
router.delete('/:isbn', bookController.remove)

module.exports = router
