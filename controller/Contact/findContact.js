const { sequelize } = require('../../db') 
const Contact = require('../../models/contact') 
module.exports = async (req, res) => {
  try {
    // Find a specific contact by its ID
    const contact = await Contact.findByPk(req.params.id)

    // If the contact is not found, return a 404 status with a message
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    // Return the found contact as a JSON response
    res.json(contact)
  } catch (error) {
    console.error(error)
    // Handle and log any internal server error and return a 500 status with a message
    res.status(500).json({ message: 'Internal server error' })
  }
}
