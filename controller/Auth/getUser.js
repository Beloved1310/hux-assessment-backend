const User = require('../../model/user')

module.exports = async (req, res) => {
  try {
    userId = req.user.id
    const user = await User.findById(userId).select('-password')
    res.send(user)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
}