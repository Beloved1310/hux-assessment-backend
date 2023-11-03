const { sequelize } = require('../../db') 
const Contact = require('../../models/contact')

module.exports = async (req, res) => {
  try {
    // Find all contacts in the database that belong to the authenticated user
    const contacts = await Contact.findAll({
      where: { user: req.user.id },
    })

    // Return the list of contacts as a JSON response
    res.json(contacts)
  } catch (error) {
    console.error(error)
    // Handle and log any internal server error and return a 500 status with a message
    res.status(500).json({ message: 'Internal server error' })
  }
}
