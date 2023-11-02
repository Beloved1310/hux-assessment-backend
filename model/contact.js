const mongoose = require('mongoose')
const { Schema } = mongoose

const ContactSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  firstName: { type: String, trim: true, required: true, maxlength: 200 },
  lastName: { type: String, trim: true, required: true, maxlength: 2000 },
  phoneNumber: { type: Number, required: true},
  date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('contact', ContactSchema)