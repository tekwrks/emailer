const logger = require('./logger')

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const add = function (members, subscribed, list) {
  mailgun
    .lists(`${list}@${process.env.MAILGUN_DOMAIN}`)
    .members()
    .add(
      {
        members: members,
        subscribed: subscribed,
      },
      function (err, body) {
        if (err) {
          logger.error(err)
        }
        logger.debug(body)
      })
}

module.exports = (list) => {
  return {
    add: function (members, subscribed) {
      add(members, subscribed, list)
    },
  }
}

