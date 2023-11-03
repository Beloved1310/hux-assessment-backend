const { sequelize } = require('../../db')
const Contact = require('../../models/contact')
module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const newContact = {}

    if (firstName) {
      newContact.firstName = firstName
    }
    if (lastName) {
      newContact.lastName = lastName
    }
    if (phoneNumber) {
      newContact.phoneNumber = phoneNumber
    }

    const contact = await Contact.findByPk(req.params.id)

    if (!contact) {
      return res.status(404).send('Not Found')
    }

    if (contact.user !== req.user.id) {
      return res.status(401).send('Not allowed')
    }

    await contact.update(newContact)
    const updatedContact = await Contact.findByPk(req.params.id)

    res.status(200).json({ contact: updatedContact })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
