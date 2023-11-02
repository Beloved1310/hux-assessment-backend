const { validationResult } = require('express-validator')
const User = require('../../model/user')
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, newPassword } = req.body
  let user = await User.findOne({ email })
  try {
    if (!user)
      return res
        .status(400)
        .send({ error: 'User with this email does not exists' })
    const salt = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(newPassword, salt)

    const update = await User.updateOne({ password: hashPassword })
    if (!update) return res.status(400).send({ error: 'reset password error' })
    success = true
    return res.json({
      message: 'Password Updated, Proceed to Login',
      success,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}