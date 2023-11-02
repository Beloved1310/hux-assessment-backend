const Contact = require('../../models/Todo')
const { validationResult } = require('express-validator')

module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const newContact= {}
    if (firstName) {
      newContact.firstName = firstName
    }
    if (lastName) {
      newContact.lastName = lastName
    }
    if (phoneNumber) {
      newContact.phoneNumber = phoneNumber
    }

    //find the note by id
    let contact = await Contact.findById(req.params.id)
    if (!contact) {
      res.status(404).send('Not Found')
    }
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).send('Not allowed')
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: newContact},
      { new: true },
    )
    res.json({ contact})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}