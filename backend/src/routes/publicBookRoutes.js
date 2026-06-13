const { Router } = require('express')
const bookController = require('../controllers/bookController')

const router = Router()

router.get('/', bookController.getAll)
router.get('/:isbn', bookController.getOne)

module.exports = router
