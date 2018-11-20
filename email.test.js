/* eslint-disable */

process.env.MAILGUN_API_KEY = "api_key"
process.env.MAILGUN_DOMAIN = "domain"

// require emailer
let email = null
beforeAll(() => {
  email = require('./email')
  return email
})

test('sets up email module', () => {
  expect(email).toBeTruthy()
})

