const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

router.get('/list', async (req, res) => res.json(await User.find({})))

router.get(
  '/item/:id',
  auth,
  async (req, res) => {
    try {
      const userItem = await User.findById(req.params.id)
      res.json(userItem)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong. Try again.' })
    }
  }
)

module.exports = router
