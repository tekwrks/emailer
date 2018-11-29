/* eslint-disable */

process.env.MAILGUN_API_KEY = "api_key"
process.env.MAILGUN_DOMAIN = "domain"

describe('usage', function() {
  jest.mock('./logger')
  const logger = require('logger')

  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const mockMailgun = {
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    update: jest.fn(() => mockMailgun),
  }
  mailgun.mockReturnValue(mockMailgun)

  const m = require('./subscription')

  test('subscribe changes the correct list', () => {
    m.subscribe('email')
    expect(mockMailgun.lists).toBeCalledWith(`users@${process.env.MAILGUN_DOMAIN}`)
  })
  test('unsubscribe changes the correct list', () => {
    m.unsubscribe('email')
    expect(mockMailgun.lists).toBeCalledWith(`users@${process.env.MAILGUN_DOMAIN}`)
  })
  test('unsubscribe sets subscribed=false', () => {
    mockMailgun.update.mockClear()
    m.unsubscribe('email')
    expect(mockMailgun.update).toBeCalled()
    expect(mockMailgun.update.mock.calls[0][0].subscribed).toBe(false)
  })
  test('subscribe sets subscribed=true', () => {
    mockMailgun.update.mockClear()
    m.subscribe('email')
    expect(mockMailgun.update).toBeCalled()
    expect(mockMailgun.update.mock.calls[0][0].subscribed).toBe(true)
  })
})

describe('error handling', function() {
  jest.resetModules()
  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const mockMailgun = {
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    update: jest.fn((opts, cb) => cb('error', null)),
  }
  mailgun.mockReturnValue(mockMailgun)

  jest.mock('./logger')
  const logger = require('./logger')
  logger.error = jest.fn()

  const m = require('./subscription')

  test('subscribe', () => {
    logger.error.mockClear()
    m.subscribe('email')
    expect(logger.error).toBeCalled()
    expect(logger.error.mock.calls[0][0]).toBe(`could not subscribe : email : error : null`)
  })
  test('unsubscribe', () => {
    logger.error.mockClear()
    m.unsubscribe('email')
    expect(logger.error).toBeCalled()
    expect(logger.error.mock.calls[0][0]).toBe(`could not unsubscribe : email : error : null`)
  })
})

describe('success handling', () => {
  jest.resetModules()
  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const mockMailgun = {
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    update: jest.fn((opts, cb) => cb(null, 'success')),
  }
  mailgun.mockReturnValue(mockMailgun)

  jest.mock('./logger')
  const logger = require('./logger')
  logger.debug = jest.fn()

  const m = require('./subscription')

  test('unsubscribe', () => {
    logger.debug.mockClear()
    m.unsubscribe('email')
    expect(logger.debug).toBeCalled()
    expect(logger.debug.mock.calls[0][0]).toBe(`unsubscribed : email : success`)
  })
  test('subscribe', () => {
    logger.debug.mockClear()
    m.subscribe('email')
    expect(logger.debug).toBeCalled()
    expect(logger.debug.mock.calls[0][0]).toBe(`subscribed : email : success`)
  })
})

