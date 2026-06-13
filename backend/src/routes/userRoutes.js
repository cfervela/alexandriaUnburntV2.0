const { Router } = require('express')
const userController = require('../controllers/userController')

const router = Router()

router.get('/', userController.getAll)
router.get('/:id', userController.getOne)
router.put('/:id', userController.update)
router.delete('/:id', userController.remove)

module.exports = router
