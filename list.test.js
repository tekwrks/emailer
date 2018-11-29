/* eslint-disable */

process.env.MAILGUN_API_KEY = "api_key"
process.env.MAILGUN_DOMAIN = "domain"

describe('usage', () => {
  jest.mock('./logger')

  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const mockMailgun = {
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    add: jest.fn(() => mockMailgun),
  }
  mailgun.mockReturnValue(mockMailgun)

  const m = require('./list')('listname')

  test('adds to correct list', () => {
    m.add(['member'], true)
    expect(mockMailgun.lists)
      .toBeCalledWith(`listname@${process.env.MAILGUN_DOMAIN}`)
  })
})

describe('error handling', () => {
  jest.resetModules()

  jest.mock('./logger')
  const logger = require('./logger')
  logger.error = jest.fn()

  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const mockMailgun = {
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    add: jest.fn((_, cb) => cb('error', null)),
  }
  mailgun.mockReturnValue(mockMailgun)

  const m = require('./list')('listname')

  test('add failed', () => {
    m.add(['member'], true)
    expect(logger.error)
      .toBeCalledWith('error')
  })
})

describe('success handling', () => {
  jest.resetModules()

  jest.mock('./logger')
  const logger = require('./logger')
  logger.debug = jest.fn()

  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const mockMailgun = {
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    add: jest.fn((_, cb) => cb(null, 'success')),
  }
  mailgun.mockReturnValue(mockMailgun)

  const m = require('./list')('listname')

  test('add failed', () => {
    m.add(['member'], true)
    expect(logger.debug)
      .toBeCalledWith('success')
  })
})

