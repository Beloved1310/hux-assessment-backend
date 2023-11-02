const { validationResult } = require('express-validator')
const User = require('../../model/user')
const bcrypt = require('bcrypt')
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
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'No User With this Email Exists' })
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      return res.status(400).json({ error: 'Please Provide a Valid Password' })
    }
    //   payload is user data
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    }
    success = true
    let name = payload.user.name
    const authToken = jwt.sign(payload, JWT_SECRET)

    res.json({ authToken, success, name })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}