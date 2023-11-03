const { sequelize } = require('../../db') 
const Contact = require('../../models/contact')
module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // If there are validation errors, return a 400 status with error details
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

    // Find a contact by its primary key (ID) from the request parameters
    const contact = await Contact.findByPk(req.params.id)

    if (!contact) {
      // If the contact is not found, return a 404 status with a message
      return res.status(404).send('Not Found')
    }

    if (contact.user !== req.user.id) {
      // If the contact doesn't belong to the authenticated user, return a 401 status
      return res.status(401).send('Not allowed')
    }

    // Update the contact with the new contact details
    await contact.update(newContact)

    // Retrieve the updated contact information
    const updatedContact = await Contact.findByPk(req.params.id)

    // Return the updated contact as a JSON response with a 200 status
    res.status(200).json({ contact: updatedContact })
  } catch (error) {
    console.error(error)
    // Handle and log any internal server error and return a 500 status with a message
    res.status(500).json({ message: error.message })
  }
}
