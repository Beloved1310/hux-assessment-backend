const { validationResult } = require('express-validator')
const { sequelize } = require('../../db')
const User = require('../../models/user')
const { JWT_SECRET } = require('../../config')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)
  // If there are validation errors, return a 400 status and the error details
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      // If the user with the provided email does not exist, return an error
      return res.status(400).json({ error: 'No User With this Email Exists' })
    }
   // Compare the provided password with the stored hashed password
    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare) {
      return res.status(400).json({ error: 'Please Provide a Valid Password' })
    }
    // Create a JWT token with user information and a success flag
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    }

    success = true
    const name = payload.user.name
    const authToken = jwt.sign(payload, JWT_SECRET)

    res.json({ authToken, success, name })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
