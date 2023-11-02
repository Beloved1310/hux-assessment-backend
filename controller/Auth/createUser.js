const { validationResult } = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../../config')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)
  const { name, email, password } = req.body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  let user = await User.findOne({ email })

  try {
    if (user) {
      return res.status(400).json({
        success: success,
        error: 'Sorry Email With this user Already Exists...',
      })
    }

    const salt = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(password, salt)
    user = await User.create({
      name,
      email,
      password : hashPassword,
    })

    const data = {
      user: {
        id: user.id,
        name : user.name,
      },
    }

    const authToken = jwt.sign(data, JWT_SECRET)
    success = true

    res.json({ authToken, success, name })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}