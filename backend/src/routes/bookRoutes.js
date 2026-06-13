const { Router } = require('express')
const bookController = require('../controllers/bookController')

const router = Router()

router.get('/', bookController.getAll)
router.post('/', bookController.create)
router.get('/:isbn', bookController.getOne)
router.put('/:isbn', bookController.update)
router.delete('/:isbn', bookController.remove)

module.exports = router
