// setup logger
const logger = require('./logger')

// requires
const app = require('express')()
const helmet = require('helmet')

app.use(helmet())

require('./email')
  .then(sender => {
    // send onboarding email
    app.get('/onboard/:email/:name', function (req, res) {
      if (req.params.email) {
        sender.onboard(req.params.email, req.params.name)
        res
          .status(200)
          .send('okay')
      }
      else {
        logger.info('got no email address - ignoring request')
        res
          .status(400)
          .send('no email address')
      }
    })

    // unsubscribe
    app.get('/unsubscribe/:email', function (req, res) {
      if (req.params.email) {
        sender.unsubscribe(req.params.email)
        res
          .status(200)
          .send('okay')
      }
      else {
        logger.info('got no email address - ignoring request')
        res
          .status(400)
          .send('no email address')
      }
    })

    app.listen(process.env.PORT, () => logger.info(`listening on ${process.env.PORT}`))
  })
  .catch(err => {
    logger.error(err)
    process.exit(0)
  })

