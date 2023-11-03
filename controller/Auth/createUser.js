const { validationResult } = require('express-validator')
const { sequelize } = require('../../db')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../../config')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)
  const { name, email, password } = req.body

  if (!errors.isEmpty()) {
    // Return validation errors if there are any
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      // Return an error response if the user already exists
      return res.status(400).json({
        success: success,
        error: 'Sorry, an account with this email already exists...',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    // Create a new user using Sequelize
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    })

    const data = {
      user: {
        id: newUser.id,
        name: newUser.name,
      },
    }

    const authToken = jwt.sign(data, JWT_SECRET)
    success = true

    // Return a success response with an authentication token and user's name
    res.json({ authToken, success, name })
  } catch (error) {
    console.error(error)
    // Return an error response if there's an internal server error
    res.status(500).json({ message: error.message })
  }
}
