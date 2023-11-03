const { sequelize } = require('../../db')
const User = require('../../models/user')
module.exports = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      return res.status(404).send('User not found')
    }

    res.send(user)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}
