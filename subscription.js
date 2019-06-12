const logger = require('./logger')

module.exports = function (mailgun) {
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

  return {
    subscribe,
    unsubscribe,
  }
}

