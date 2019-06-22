/* eslint-disable */

const PORT = 3000
const ADDRESS = `localhost:${PORT}`

const request = require('supertest')(ADDRESS)

const { create, ready, kill } = require('./docker')

const express = require('express')
const app = express()

describe('api', () => {
  let mailgunServer = null

  beforeAll(() => {
    // setup mailgun-mock server
    app.all('*', (req, res) => {
      console.log('mock-mailgun : ' + req.url)
      res.send('OK')
    })
    mailgunServer = app.listen(3002, () => console.log(`Mock mailgun app listening on port 3002`))

    // create the container
    return create()
  }, 60 * 1000)

  it('readiness probe route responds positivelly', () => {
    return request.get('/ready')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('subscribes an email', () => {
    const email = "user@acme.com"

    return request.get('/subscribe/' + email)
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })

  it('onboard a new user', () => {
    const email = "user@acme.com"
    const name = "user"

    return request.get('/onboard/' + email + '/' + name)
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })

  afterAll(() => {
    // shutdown mock-mailgun
    mailgunServer.close()

    // kill container
    kill()
  })
})

