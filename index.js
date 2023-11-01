//get the function name from the db.js file which is exported

//run the function call

//install the express and load the nodejs application
const express = require('express')
const app = express()
const { PORT } = require('./config')
const connectToMongo = require('./db')
var cors = require('cors')

app.use(cors({ origin: '*' }))
app.use(express.json())

connectToMongo()

app.use('/api/auth', require('./routes/Auth'))
app.use('/api/contact', require('./routes/contactInfo'))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})