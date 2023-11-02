const Contact = require('../../models/contact')
const { validationResult } = require('express-validator')

module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const Contact = new Contact({
      firstName,
      lastName,
      phoneNumber,
      user: req.user.id,
    })
    const saveContact = await Contact.save()
    res.json(saveContact)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
