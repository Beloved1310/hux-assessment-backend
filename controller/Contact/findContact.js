const { sequelize } = require('../../db')
const Contact = require('../../models/contact')

module.exports = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.json(contact)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
