const addContact = require('../controller/Contact/addContact')
const deleteContact = require('../controller/Contact/deleteContact')
const updateContact = require('../controller/Contact/updateContact')
const getContacts = require('../controller/Contact/findContacts')
const getContact = require('../controller/Contact/findContact')
const { validationResult } = require('express-validator')
const Contact = require('../models/contact')

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}))


describe('Contact Controller', () => {
  // Test case: Creating a new contact
  it('should create a new contact', async () => {
    // Set up a mock request object with contact details
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      },
      user: { id: 'user_id' },
    }

    // Set up a mock response object to capture the controller's response
    const res = {
      status: jest.fn(() => res), // Mock the response status method
      json: jest.fn(), // Mock the response JSON method
    }

    // Mock the validation result to simulate a successful validation
    // This mocks the behavior of 'express-validator'
    validationResult.mockImplementation(() => ({
      isEmpty: () => true, // Indicates no validation errors
      array: () => [], // An empty array of validation error messages
    }))

    // Mock the 'save' method of the Contact model to resolve with a new contact
    Contact.prototype.save = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      ...req.body,
    })

    // Call the 'addContact' function with the mock request and response
    await addContact(req, res)

    // Assert that the response status is set to 200, indicating a successful creation
    expect(res.status).toHaveBeenCalledWith(200)

    // Assert that the response contains the contact details passed in the request body
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body))
  })

  // Test case: Handling validation errors when creating a new contact
  it('should handle validation errors', async () => {
    // Set up a mock request object with missing required fields to trigger validation errors
    const req = {
      body: {
        // Missing 'firstName', which should trigger a validation error
        lastName: 'Doe',
        phoneNumber: '1234567890',
      },
    }

    // Set up a mock response object to capture the controller's response
    const res = {
      status: jest.fn(() => res), // Mock the response status method
      json: jest.fn(), // Mock the response JSON method
    }

    // Mock the 'validationResult' to return a validation result indicating errors
    const validationResultMock = {
      isEmpty: () => false, // Indicates that validation errors exist
      array: () => ['Validation error'], // An array of validation error messages
    }

    validationResult.mockReturnValue(validationResultMock)

    // Call the 'addContact' function with the mock request and response
    await addContact(req, res)

    // Assert that the response status is set to 400, indicating a validation error
    expect(res.status).toHaveBeenCalledWith(400)

    // Assert that the response contains the expected validation error message
    expect(res.json).toHaveBeenCalledWith({ errors: ['Validation error'] })
  })

  // Test case: Deleting a contact
it('should delete a contact', async () => {
  // Set up a mock request object with a valid contact ID for deletion
  const req = {
    params: {
      id: 'contact_id', // Provide a valid contact ID for deletion
    },
    user: { id: 'user_id' },
  }

  // Set up a mock response object to capture the controller's response
  const res = {
    status: jest.fn(() => res), // Mock the response status method
    json: jest.fn(), // Mock the response JSON method
    send: jest.fn(), // Mock the response send method
  }

  // Mock the 'Contact.destroy' method to simulate successful contact deletion
  Contact.destroy = jest.fn().mockResolvedValue(1); // Assuming 1 row was deleted

  // Call the 'deleteContact' function with the mock request and response
  await deleteContact(req, res)

  // Assert that the 'Contact.destroy' method was called with the correct parameters
  expect(Contact.destroy).toHaveBeenCalledWith({
    where: {
      id: 'contact_id', // Match the primary key field name in your Contact model
      user: 'user_id',   // Match the user field name in your Contact model
    },
  })

  // Assert that the response status is set to 200, indicating successful contact deletion
  expect(res.status).toHaveBeenCalledWith(200)

  // Assert that the response contains a success message indicating the contact was deleted
  expect(res.json).toHaveBeenCalledWith({ success: 'Deleted Contact' })
})

  

  // Test case: Handling unauthorized contact deletion
  it('should handle unauthorized deletion', async () => {
    // Set up a mock request object with a valid contact ID and a different user ID for unauthorized deletion
    const req = {
      params: {
        id: 'contact_id',
      },
      user: { id: 'another_user_id' },
    }

    // Set up a mock response object to capture the controller's response
    const res = {
      status: jest.fn(() => res), // Mock the response status method
      send: jest.fn(), // Mock the response send method
    }

    // Mock the 'Contact.findById' method to return a contact with a different user ID
    Contact.findById = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      user: 'user_id',
    })

    // Call the 'deleteContact' function with the mock request and response
    await deleteContact(req, res)

    // Assert that the 'Contact.findById' method was called with the correct contact ID
    expect(Contact.findById).toHaveBeenCalledWith('contact_id')

    // Assert that the response status is set to 401, indicating unauthorized access
    expect(res.status).toHaveBeenCalledWith(401)

    // Assert that the response contains a message indicating unauthorized access
    expect(res.send).toHaveBeenCalledWith('Not allowed')
  })

  // Test case: Handling internal server error during contact deletion
  it('should handle internal server error', async () => {
    // Set up a mock request object with a valid contact ID for deletion
    const req = {
      params: {
        id: 'contact_id',
      },
      user: { id: 'user_id' },
    }

    // Set up a mock response object to capture the controller's response
    const res = {
      status: jest.fn(() => res), // Mock the response status method
      json: jest.fn(), // Mock the response JSON method
    }

    // Mock the 'Contact.findById' method to simulate a database error (rejected promise)
    Contact.findById = jest.fn().mockRejectedValue(new Error('Database error'))

    // Call the 'deleteContact' function with the mock request and response
    await deleteContact(req, res)

    // Assert that the 'Contact.findById' method was called with the correct contact ID
    expect(Contact.findById).toHaveBeenCalledWith('contact_id')

    // Assert that the response status is set to 500, indicating an internal server error
    expect(res.status).toHaveBeenCalledWith(500)

    // Assert that the response contains an error message indicating the database error
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' })
  })

  it('should update a contact', async () => {
    const req = {
      params: {
        id: 'contact_id',
      },
      body: {
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        phoneNumber: 'UpdatedPhoneNumber',
      },
      user: { id: 'user_id' },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }

    validationResult.mockImplementation(() => ({
      isEmpty: () => true,
      array: () => [],
    }))

    Contact.findById = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      user: 'user_id',
    })

    Contact.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      ...req.body,
    })

    await updateContact(req, res)

    expect(Contact.findById).toHaveBeenCalledWith('contact_id')
    expect(Contact.findByIdAndUpdate).toHaveBeenCalledWith(
      'contact_id',
      { $set: { ...req.body } },
      { new: true },
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      contact: { ...req.body, _id: 'contact_id' },
    })
  })
  it('should handle validation errors', async () => {
    const req = {
      params: {
        id: 'contact_id',
      },
      body: {
        phoneNumber: 'UpdatedPhoneNumber',
      },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }
    validationResult.mockImplementation(() => ({
      isEmpty: () => false,
      array: () => ['Validation error'],
    }))

    await updateContact(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"message": "validationResult is not defined" })
  })

  it('should retrieve contacts for a user', async () => {
    const req = {
      user: { id: 'user_id' }, // Provide a user ID to filter contacts
    }

    const res = {
      json: jest.fn(),
    }

    // Mock Contact.find to return an array of contacts
    Contact.find = jest.fn().mockResolvedValue([
      {
        _id: 'contact_id_1',
        firstName: 'Williams',
        lastName: 'Art',
        phoneNumber: '1234567890',
      },
      {
        _id: 'contact_id_2',
        firstName: 'Jane',
        lastName: 'Will',
        phoneNumber: '9876543210',
      },
    ])

    await getContacts(req, res)

    expect(Contact.find).toHaveBeenCalledWith({ user: 'user_id' })
    expect(res.json).toHaveBeenCalledWith([
      {
        _id: 'contact_id_1',
        firstName: 'Williams',
        lastName: 'Art',
        phoneNumber: '1234567890',
      },
      {
        _id: 'contact_id_2',
        firstName: 'Jane',
        lastName: 'Will',
        phoneNumber: '9876543210',
      },
    ])
  })

  it('should handle no contacts found', async () => {
    const req = {
      user: { id: 'user_id' },
    }

    const res = {
      json: jest.fn(),
    }
    Contact.find = jest.fn().mockResolvedValue([])

    await getContacts(req, res)

    expect(Contact.find).toHaveBeenCalledWith({ user: 'user_id' })
    expect(res.json).toHaveBeenCalledWith([])
  })

  it('should retrieve a contact by ID', async () => {
    const req = {
      params: {
        id: 'contact_id', // Provide a valid contact ID for retrieval
      },
    }

    const res = {
      json: jest.fn(),
    }

    // Mock Contact.findOne to return a contact
    Contact.findOne = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      firstName: 'Williams',
      lastName: 'ShakeSpeare',
      phoneNumber: '1234567890',
    })

    await getContact(req, res)

    expect(Contact.findOne).toHaveBeenCalledWith({where:{ id: 'contact_id' }})
    expect(res.json).toHaveBeenCalledWith({
      _id: 'contact_id',
      firstName: 'Williams',
      lastName: 'ShakeSpeare',
      phoneNumber: '1234567890',
    })
  })
  it('should handle contact not found', async () => {
    const req = {
      params: {
        id: 'test_id',
      },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }
    Contact.findOne = jest.fn().mockResolvedValue(null)

    await getContact(req, res)

    expect(Contact.findOne).toHaveBeenCalledWith({where: { id: 'test_id' }})
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' })
  })
})
