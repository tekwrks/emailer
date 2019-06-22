const request = require('request')
const { Docker } = require('node-docker-api')

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

let container = null
let logstream = null

function create() {
    return docker.container.create({
      Image: 'multipl/mailgun:latest',
      Env: [
        "PROGRAM_ALIAS=mailgun_integration_test",
        "PORT=3000",
        "LOG_FILE=false",
        "LOG_LEVEL=debug",
        "MAILGUN_API_KEY=api_key",
        "MAILGUN_DOMAIN=mail.multipl.io",

        "http_proxy=http://127.0.0.1:3002",
        "https_proxy=http://127.0.0.1:3002",
      ],
      HostConfig: {
        PortBindings: {
          "3000/tcp": [{
            "HostPort": "3000",
          }],
        },
        NetworkMode: "host",
      },
    })
      .then(c => {
        container = c
        console.log('Container created')
        return c.start()
      })
      .then((c) => c.logs({
        follow: true,
        stdout: true,
        stderr: true,
      }))
      .then(stream => {
        logstream = stream
        stream.on('data', info => console.log(info.toString()))
        stream.on('error', err => console.log(err.toString()))
      })
      .then(() => {
        console.log('Container started')
        return ready("/ready")
      })
      .catch(error => console.log(error))
}

function ready(path) {
  const timeout = 1000
  let tries = 100

  return new Promise((resolve, reject) => {
    const check = () => {
      console.log("Ready check")

      if (tries-- <= 0) {
        reject("Max readiness tries reached.")
      }

      request
        .get("http://127.0.0.1:3000" + path)
        .on('response', function(response) {
          if (response.statusCode == 200) {
            console.log("Container ready")
            resolve(response)
          }
          else {
            setTimeout(check, timeout)
          }
        })
        .on('error', (error) => {
          setTimeout(check, timeout)
        })
    }

    setTimeout(check, timeout)
  })
}

function kill() {
  // shutdown log stream
  logstream.destroy()

  // kill container
  if (container != null) {
    return container.stop()
      .then(c => c.delete())
      .catch((error) => console.log(error))
  }
  else {
    return Promise.resolve(true)
  }
}

module.exports = {
  create,
  ready,
  kill,
}

