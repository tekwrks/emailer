/* eslint-disable */

process.env.MAILGUN_API_KEY = "api_key"
process.env.MAILGUN_DOMAIN = "domain"

describe('usage', () => {
  jest.mock('./logger')

  jest.mock('./list')

  jest.mock('./loadTemplate')
  const loadTemplate = require('./loadTemplate')
  loadTemplate.__template = 'template'

  jest.mock('mailgun-js')
  const mailgun = require('mailgun-js')
  const sendMime = jest.fn()
  const mockMailgun = {
    messages: jest.fn(() => {
      return {
        sendMime: sendMime,
      }
    }),
    lists: jest.fn(() => mockMailgun),
    members: jest.fn(() => mockMailgun),
    update: jest.fn(() => mockMailgun),
  }
  mailgun.mockReturnValue(mockMailgun)

  const m = require('./email')

  test('sendMime was called', done => {
    sendMime.mockImplementation(({to, message}, cb) => {
      expect(to).toBe('email')
      done()
    })
    m.then(({ onboard }) => onboard('email', 'name'))
  })
})

