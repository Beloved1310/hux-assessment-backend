const { validationResult } = require('express-validator')
const { sequelize } = require('../../db')
const Contact = require('../../models/contact')
module.exports = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body // Extract data from the request body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // Return a 400 status and the error details if there are validation errors
      return res.status(400).json({ errors: errors.array() })
    }

    // Create a new contact using the Contact model and data from the request
    const newContact = await Contact.create({
      firstName,
      lastName,
      phoneNumber: parseInt(phoneNumber), // Convert phoneNumber to an integer
      user_id: req.user.id, // Associate the contact with the authenticated user
    })

    // Return a 200 status and the newly created contact
    res.status(200).json(newContact)
  } catch (error) {
    console.error(error)
    // Handle and log any internal server error and return a 500 status
    res.status(500).json({ message: error.message })
  }
}
