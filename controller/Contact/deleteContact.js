const { sequelize } = require('../../db')
const Contact = require('../../models/contact')

module.exports = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id)

    if (!contact) {
      return res.status(404).send('Not Found')
    }
    if (contact.user !== req.user.id) {
      return res.status(401).send('Not allowed')
    }

    await contact.destroy()

    res.status(200).json({ success: 'Deleted Contact' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
