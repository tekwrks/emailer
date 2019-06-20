/* eslint-disable */

const PORT = 3000
const ADDRESS = `localhost:${PORT}`

const request = require('supertest')(ADDRESS)

const { Docker } = require('node-docker-api')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

function readinessProbe(path) {
  const timeout = 1000
  let tries = 100

  return new Promise((resolve, reject) => {
    const check = () => {
      console.log("Ready check")

      if (tries-- <= 0) {
        reject("Max readiness tries reached.")
      }

      request
        .get(path)
        .then(response => {
          if (response.statusCode == 200) {
            console.log("Container ready")
            resolve(response)
          }
          else {
            setTimeout(check, timeout)
          }
        })
        .catch(error => {
          setTimeout(check, timeout)
        })
    }

    setTimeout(check, timeout)
  })
}

describe('api', () => {
  let container = null

  beforeAll(() => {
    // create the container
    return docker.container.create({
      Image: 'multipl/mailgun:latest',
      name: 'test-mailgun-integration',
      Env: [
        "PROGRAM_ALIAS=mailgun_integration_test",
        "PORT=3000",
        "LOG_FILE=false",
        "LOG_LEVEL=debug",
        "MAILGUN_API_KEY=api_key",
        "MAILGUN_DOMAIN=mail.multipl.io",
      ],
      HostConfig: {
        PortBindings: {
          "3000/tcp": [{
            "HostPort": "3000",
          }],
        },
      },
    })
      .then(c => {
        container = c
        console.log('Container created')
        return c.start()
      })
      .then(() => {
        console.log('Container started')
        return readinessProbe("/ready")
      })
      .catch(error => console.log(error))
  }, 30000)

  it('readiness probe route responds positivelly', () => {
    return request.get('/ready')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })

  afterAll(() => {
    if (container != null) {
      return container.stop()
        .then(c => c.delete())
        .catch((error) => console.log(error))
    }
    else {
      return Promise.resolve(true)
    }
  })
})

