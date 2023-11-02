const Contact = require('../../models/contact')

module.exports = async (req, res) => {
  try {
    //find the note by delete
    let contact = await Contact.findById(req.params.id)
    if (!Contact) {
      res.status(404).send('Not Found')
    }

    // allow deletion

    if (Contact.user.toString() !== req.user.id) {
      return res.status(401).send('Not allowed')
    }

    contact = await Contact.findByIdAndDelete(req.params.id)
    res.json({ success: 'deleted Contact' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}