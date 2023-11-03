const { validationResult } = require('express-validator')
const { sequelize } = require('../../db')
const User = require('../../models/user')
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
  let success = false
  const errors = validationResult(req)

  // Check if there are any validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, newPassword } = req.body

  try {
    // Find the user with the provided email
    const user = await User.findOne({ where: { email } })

    if (!user) {
      // Return an error if the user does not exist
      return res
        .status(400)
        .json({ error: 'User with this email does not exist' })
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    // Update the user's password using Sequelize
    const updatedUser = await user.update({ password: hashPassword })

    if (!updatedUser) {
      // Return an error if there's an issue with password reset
      return res.status(400).json({ error: 'Password reset error' })
    }

    success = true
    // Return a success message
    return res.json({
      message: 'Password Updated, Proceed to Login',
      success,
    })
  } catch (error) {
    console.error(error)
    // Return an error response if there's an internal server error
    res.status(500).json({ message: error.message })
  }
}
