const express = require('express')
const router = express.Router()
const authUser = require('../middleware/authUser')
const { body } = require('express-validator')
const addContact= require('../controller/Contact/addContact')
const updateContact= require('../controller/Contact/updateContact')
const deleteContact= require('../controller/Contact/deleteContact')
const fetchAllContact= require('../controller/Contact/findContacts')
const findContact= require('../controller/Contact/findContact')

router.post(
  '/addContact',
   authUser,
   [
    body('firstName')
      .isString()
      .isLength({ min: 3 })
      .withMessage('First Name must be at least 3 characters long'),

    body('lastName')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Last Name must be at least 3 characters long'),

    body('phoneNumber')
      .isString()
      .notEmpty()
      .withMessage('Phone Number is required')
  ],
  addContact,
)

router.put(
  '/updateContact/:id',
  authUser,
  [
    body('firstName')
      .isString()
      .isLength({ min: 3 })
      .withMessage('First Name must be at least 3 characters long'),

    body('lastName')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Last Name must be at least 3 characters long'),

    body('phoneNumber')
      .isString()
      .notEmpty()
      .withMessage('Phone Number is required')
  ],
  updateContact,
)

router.delete('/deleteContact/:id', authUser, deleteContact)

router.get('/fetchContact/:id', authUser, findContact)

router.get('/fetchAllContact', authUser, fetchAllContact)
module.exports = router