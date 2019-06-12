// setup logger
const logger = require('./logger')

// requires
const validator = require('email-addresses')
const app = require('express')()
app.use(require('helmet')())

// unsubscribe
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})
const subscription = require('./subscription')(mailgun)

app.get('/unsubscribe/:email', function (req, res) {
  if (req.params.email) {
    const email = validator.parseOneAddress(req.params.email)
    if (email === null) {
      logger.info(`Got invalid email address : ${req.params.email}`)
    }
    else {
      subscription.unsubscribe(email.address)
    }
  }
  else {
    logger.info('got no email address - ignoring request')
  }
  res.redirect('/unsubscribed')
})
app.get('/subscribe/:email', function (req, res) {
  if (req.params.email) {
    const email = validator.parseOneAddress(req.params.email)
    if (email === null) {
      logger.info(`Got invalid email address : ${req.params.email}`)
      res.status(400).send('invalid email')
    }
    else {
      subscription.subscribe(email.address)
      res.status(200).send('Subscribed!')
    }
  }
  else {
    logger.info('got no email address - ignoring request')
    res.status(400).send('missing email')
  }
})

// emails
require('./email')
  .then(sender => {
    // send onboarding email
    app.get('/onboard/:email/:name', function (req, res) {
      if (req.params.email) {
        sender.onboard(req.params.email, req.params.name)
        res.status(200).send('okay')
      }
      else {
        logger.info('got no email address - ignoring request')
        res.status(400).send('missing email')
      }
    })

    // readiness probe
    app.get('/ready', function (req, res) {
      res
        .status(200)
        .send('ok')
    })
    // start server
    app.listen(process.env.PORT,
      () => logger.info(`listening on ${process.env.PORT}`))
  })
  .catch(err => {
    logger.error(err)
    process.exit(0)
  })

