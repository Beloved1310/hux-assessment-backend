const mongoose = require('mongoose')

const { MONGODBURI } = require('./config')

const connectToMongo = async () => {
  mongoose.set('strictQuery', false)
  const mongooseConnect = await mongoose.connect(MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  if (mongooseConnect) {
    console.log('Connected to Database')
  } else {
    console.log('Not Connected to Database')
  }
}

module.exports = connectToMongo