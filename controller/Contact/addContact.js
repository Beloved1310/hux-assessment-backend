const Contact = require('../../model/contact')
const { validationResult } = require('express-validator')

module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const contact = new Contact({
      firstName,
      lastName,
      phoneNumber: parseInt(phoneNumber),
      user: req.user.id,
    })
    const saveContact = await contact.save()
    res.status(200).json(saveContact)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
