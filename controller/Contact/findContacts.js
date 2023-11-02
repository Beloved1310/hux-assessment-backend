const Contact = require('../../model/contact')

module.exports = async (req, res) => {
  const contact = await Contact.find({ user: req.user.id })
  res.json(contact)
}