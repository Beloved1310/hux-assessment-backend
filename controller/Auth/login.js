const { validationResult } = require('express-validator')
const { sequelize } = require('../../db')
const User = require('../../models/user')
const { JWT_SECRET } = require('../../config')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(400).json({ error: 'No User With this Email Exists' })
    }

    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare) {
      return res.status(400).json({ error: 'Please Provide a Valid Password' })
    }

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
