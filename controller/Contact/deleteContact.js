const { sequelize } = require('../../db') 
const Contact = require('../../models/contact') 

module.exports = async (req, res) => {
  try {
    // Find a contact by its primary key (ID) from the request parameters
    const contact = await Contact.findByPk(req.params.id)

    if (!contact) {
      // If the contact is not found, return a 404 status (Not Found)
      return res.status(404).send('Not Found')
    }

    if (contact.user !== req.user.id) {
      // If the contact's user ID does not match the authenticated user's ID, return a 401 status (Not allowed)
      return res.status(401).send('Not allowed')
    }

    // Delete the contact from the database
    await contact.destroy()

    // Return a 200 status and a success message
    res.status(200).json({ success: 'Deleted Contact' })
  } catch (error) {
    console.error(error)
    // Handle and log any internal server error and return a 500 status
    res.status(500).json({ message: error.message })
  }
}
