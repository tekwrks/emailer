const logger = require('./logger')

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const updateSub = function (email, sub) {
  mailgun
    .lists(`users@${process.env.MAILGUN_DOMAIN}`)
    .members(email)
    .update(
      {
        subscribed: sub,
      },
      function (err, body) {
        if (err) {
          logger.error(`could not ${sub ? '' : 'un'}subscribe : ${email} : ${err} : ${body}`)
        }
        else {
          logger.debug(`${sub ? '' : 'un'}subscribed : ${email} : ${body}`)
        }
      })
}
const unsubscribe = function (email) {
  updateSub(email, false)
}
const subscribe = function (email) {
  updateSub(email, true)
}

module.exports = {
  subscribe,
  unsubscribe,
}

