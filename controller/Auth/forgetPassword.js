const { validationResult } = require('express-validator')
const { sequelize } = require('../../db') 
const User = require('../../models/user') 
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, newPassword } = req.body

  try {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res
        .status(400)
        .json({ error: 'User with this email does not exist' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    // Update the user's password using Sequelize
    const updatedUser = await user.update({ password: hashPassword })

    if (!updatedUser) {
      return res.status(400).json({ error: 'Password reset error' })
    }

    success = true
    return res.json({
      message: 'Password Updated, Proceed to Login',
      success,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
