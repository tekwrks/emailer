/* eslint-disable */

const PORT = 3000
const ADDRESS = `localhost:${PORT}`

const request = require('supertest')(ADDRESS)

describe('api', () => {
  it('answers to ready check', () => {
    return request.get('/ready')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })
})

