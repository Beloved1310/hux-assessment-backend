const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authUser = require('../middleware/authUser')
const createUser = require('../controller/Auth/createUser')
const login = require('../controller/Auth/login')
const getUser = require('../controller/Auth/getUser')
const forgetPassword = require('../controller/Auth/forgetPassword')

router.post(
  '/createUser/',

  [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Enter a Valid Password').isLength({ min: 3 }),
  ],
  createUser,
)

//login user api call

router.post(
  '/loginUser/',
  [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'password cannot be blank').exists(),
  ],
  login,
)

router.post(
  '/forgetPassword/',
  [
    body('email', 'Enter a Valid Email').isEmail(),
    body('newPassword', 'password cannot be blank').exists(),
  ],
  forgetPassword,
)

//Get user details  using middleware as post method "/api/auth/getuser"

router.post('/getUser', authUser, getUser)

module.exports = router