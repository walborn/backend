const { Router } = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post(
  '/signup',
  async (req, res) => {
    try {
      const { email, password } = req.body
      const candidate = await User.findOne({ email })
      if (candidate) return res.status(400).json({ message: 'Such user is already exist'})
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })

      await user.save()
      res.status(201).json({ message: 'New user created' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong. Try again.'})
    }
  }
)

router.post(
  '/signin',
  async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: 'Such user is not exist'})

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ message: 'Wrong login or password' })

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

      res.status(200).json({ token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: `Sign in: Something went wrong. Try again. ${process.env.JWT_SECRET}`})
    }
  }
)

module.exports = router