const Contact = require('../../model/contact')

module.exports = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id })

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.json(contact)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
