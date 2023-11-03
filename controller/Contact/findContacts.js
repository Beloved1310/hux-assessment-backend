const { sequelize } = require('../../db')
const Contact = require('../../models/contact')

module.exports = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { user: req.user.id },
    })

    res.json(contacts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
