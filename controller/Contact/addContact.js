const { validationResult } = require('express-validator')
const { sequelize } = require('../../sequelize')
const Contact = require('../../models/contact')
module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const newContact = await Contact.create({
      firstName,
      lastName,
      phoneNumber: parseInt(phoneNumber),
      user_id: req.user.id,
    })

    res.status(200).json(newContact)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}
