const { sequelize } = require('../../db')
const User = require('../../models/user')

module.exports = async (req, res) => {
  try {
    // Retrieve the user ID from the request
    const userId = req.user.id

    // Find the user by their ID, excluding the password attribute
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      // If the user is not found, return a 404 status and message
      return res.status(404).send('User not found')
    }

    // Return the user data (excluding the password) as a response
    res.send(user)
  } catch (error) {
    console.error(error)
    // Handle and log any internal server error and return a 500 status
    res.status(500).send('Internal Server Error')
  }
}
