//get the function name from the db.js file which is exported

//run the function call

//install the express and load the nodejs application
const express = require('express')
const app = express()
const { PORT } = require('./config')
const connectToMongo = require('./db')
const user = require('./routes/Auth')
const contact = require('./routes/ContactInfo')
const cors = require('cors')

app.use(cors({ origin: '*' }))
app.use(express.json())

connectToMongo()

app.use('/api/auth', user)
app.use('/api/contact', contact)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
