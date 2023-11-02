const express = require('express')
const router = express.Router()
const authUser = require('../middleware/authUser')
const { body } = require('express-validator')
const addContact= require('../controller/Contact/addContact')
const updateContact= require('../controller/Contact/updateContact')
const deleteContact= require('../controller/Contact/deleteContact')
const fetchAllContact= require('../controller/Contact/findContacts')

router.post(
  '/addContact',
  authUser,
  [
    body('firstName', 'Title must be atleast 3 characters...').isLength({ min: 3 }),
    body('lastName', 'Title must be atleast 3 characters...').isLength({ min: 3 }),
    body('phoneNumber', 'Enter a Valid Task'),
  ],
  addContact,
)

router.put(
  '/updateContact/:id',
  authUser,
  [
    body('firstName', 'Title must be atleast 3 characters...').isLength({ min: 3 }),
    body('lastName', 'Title must be atleast 3 characters...').isLength({ min: 3 }),
    body('phoneNumber', 'Enter a Valid Task'),
  ],
  updateContact,
)

router.delete('/deleteContact/:id', authUser, deleteContact)

router.get('/fetchAllContact', authUser, fetchAllContact)
module.exports = router