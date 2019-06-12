/* eslint-disable */

describe('email validation', function() {
  jest.resetModules()

  const validator = require('email-addresses')

  test('recognizes valid address', () => {
    const address = 'valid@acme.com'
    const email = validator.parseOneAddress(address)
    expect(email.address).toBe(address)
  })
  test('rejects invalid address', () => {
    const address = 'invalid'
    const email = validator.parseOneAddress(address)
    expect(email).toBeNull()
  })
})

