const addContact = require('../controller/Contact/addContact')
const deleteContact = require('../controller/Contact/deleteContact')
const updateContact = require('../controller/Contact/updateContact')
const getContacts = require('../controller/Contact/findContacts')
const getContact = require('../controller/Contact/findContact')
const { validationResult } = require('express-validator')
const Contact = require('../model/contact')

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}))

describe('Contact Controller', () => {
  it('should create a new contact', async () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      },
      user: { id: 'user_id' },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }

    // Mock validationResult to return an object with the necessary methods
    validationResult.mockImplementation(() => ({
      isEmpty: () => true,
      array: () => [],
    }))

    Contact.prototype.save = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      ...req.body,
    })

    await addContact(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body))
  })

  it('should handle validation errors', async () => {
    const req = {
      body: {
        // Missing firstName, which should trigger a validation error
        lastName: 'Doe',
        phoneNumber: '1234567890',
      },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }

    // Mock validationResult to return an object with the necessary methods
    const validationResultMock = {
      isEmpty: () => false,
      array: () => ['Validation error'],
    }

    validationResult.mockReturnValue(validationResultMock)

    await addContact(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ errors: ['Validation error'] })
  })

  it('should delete a contact', async () => {
    const req = {
      params: {
        id: 'contact_id', // Provide a valid contact ID for deletion
      },
      user: { id: 'user_id' },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    }

    // Mock Contact.findById to return a contact
    Contact.findById = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      user: 'user_id', // Set the user to match the req.user.id
    })

    // Mock Contact.findByIdAndDelete to simulate successful deletion
    Contact.findByIdAndDelete = jest.fn().mockResolvedValue({
      _id: 'contact_id',
    })
    await deleteContact(req, res)

    expect(Contact.findById).toHaveBeenCalledWith('contact_id')
    expect(Contact.findByIdAndDelete).toHaveBeenCalledWith('contact_id')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: 'Deleted Contact' })
  })
  it('should handle unauthorized deletion', async () => {
    const req = {
      params: {
        id: 'contact_id',
      },
      user: { id: 'another_user_id' },
    }

    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    }

    Contact.findById = jest.fn().mockResolvedValue({
      _id: 'contact_id',
      user: 'user_id',
    })

    await deleteContact(req, res)

    expect(Contact.findById).toHaveBeenCalledWith('contact_id')
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Not allowed')
  })

  it('should handle internal server error', async () => {
    const req = {
      params: {
        id: 'contact_id',
      },
      user: { id: 'user_id' },
    }

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }

    Contact.findById = jest.fn().mockRejectedValue(new Error('Database error'))

    await deleteContact(req, res)

    expect(Contact.findById).toHaveBeenCalledWith('contact_id')
    expect(res.status).toHaveBeenCalledWith(500)
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

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ errors: ['Validation error'] })
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

    expect(Contact.findOne).toHaveBeenCalledWith({ _id: 'contact_id' })
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

    expect(Contact.findOne).toHaveBeenCalledWith({ _id: 'test_id' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' })
  })
})
