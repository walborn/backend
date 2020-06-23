const router = require('express').Router()
const auth = require('../middleware/auth')
const user = require('../controllers/user')

router.get('/list', auth, user.fetchList)
router.post('/item', auth, user.createItem)
router.put('/item/:id', auth, user.updateItem)
router.delete('/item/:id', auth, user.deleteItem)
router.get('/me', auth, user.fetchMe)


module.exports = router
