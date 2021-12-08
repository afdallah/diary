const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authenticate = require('../middlewares/authenticate')

const router = express.Router()

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const users = await User.find({})

    res.json({
      status: true,
      message: 'Successfully fetch all users',
      users
    })
  } catch (error) {
    res.status(404).json({ status: false, message: error.message, users: [] })
  }
})

// Register a new user
router.post('/register', async function (req, res, next) {
  const { password, passwordConfirm, ...user } = req.body

  try {
    const isExist = await User.findOne({ email: user.email })

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ status: false, message: 'Password do not match!' })
    }

    const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10))

    if (isExist) {
      return res
        .status(400)
        .json({
          status: false,
          message: 'User already exist, use another email!'
        })
    }

    console.log
    let saved = await User.create({
      ...user,
      hashPassword
    })

    saved = saved.toObject()
    saved.token = jwt.sign({ _id: saved._id }, process.env.JWT_SECRET)
    delete saved.hashPassword
    delete saved.pin

    res.status(201).json({
      status: true,
      message: 'Successfully registered a new user',
      user: saved
    })
  } catch (error) {
    res.status(400).json({ status: false, message: error.message })
  }
})

// Login a user
router.post('/login', async function (req, res, next) {
  try {
    let user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    }) // Find a user by email and password
      .select('-hashPassword -pin')

    user = user.toObject()
    user.token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.json({
      status: true,
      message: 'Successfully logged in',
      user
    })
  } catch (error) {
    res.status(400).json({ status: false, message: error.message })
  }
})

// Get current user
router.get('/me', authenticate, async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ status: false, message: 'User not found' })

    res.json({
      status: true,
      message: 'Successfully fetched current user',
      user
    })
  } catch (error) {
    res.status(400).json({ status: false, message: error.message })
  }
})

// Update a user
router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body) // Find a user by id and update it
      .select('-hashPassword -pin')

    res.json({
      // Send a response
      status: true,
      message: 'Successfully updated a user',
      user
    })
  } catch (error) {
    res.status(404).json({ status: false, message: error.message, user: {} })
  }
})

// Delete a user
router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id) // Find a user by id and delete it
      .select('-hashPassword -pin')

    res.json({
      status: true,
      message: 'Successfully deleted a user',
      user
    })
  } catch (error) {
    res.status(404).json({ status: false, message: error.message, user: {} })
  }
})

router.post('/unlock', authenticate, function (req, res, next) {
  if (!req.body.pin) {
    return res.status(400).json({
      status: false,
      message: 'Pin is required!'
    })
  }

  User.findOne({ _id: req.user._id })
    .then(user => {
      if (user.pin !== req.body.pin) {
        return res.status(400).json({
          status: false,
          message: 'Incorrect pin'
        })
      }

      res.status(200).json({
        status: true,
        message: `Weolcome ${user.fullName.split(' ')[0]}`
      })
    })
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    )
})

module.exports = router
