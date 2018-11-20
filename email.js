const logger = require('./logger')

const MailComposer = require('nodemailer/lib/mail-composer')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const mail = new MailComposer(require('./templates/onboard'))

module.exports = new Promise(function (resolve, reject) {
  const newJoined = function (email, name) {
    mail.compile().build((err, message) => {
      if (err) {
        logger.error(`could not compile email : ${err}`)
        return
      }

      const msg = message.toString('ascii')
      logger.info('message compiled')

      // send the onboarding email
      let dataToSend = {
        to: email,
        message: msg,
      }
      mailgun.messages().sendMime(
        dataToSend,
        (sendError, body) => {
          logger.info(body)
          if (sendError) {
            logger.error(sendError)
          }
        })
    })

    // add to mailing list
    const members = [{
      address: email,
      name: name || '',
    }]
    mailgun
      .lists(`users@${process.env.MAILGUN_DOMAIN}`)
      .members()
      .add(
        {
          members: members,
          subscribed: true,
        },
        function (err, body) {
          if (err) {
            logger.error(err)
          }
          logger.info(body)
        })
  }

  const unsub = function (email) {
    mailgun
      .lists(`users@${process.env.MAILGUN_DOMAIN}`)
      .members(email)
      .update({ subscribed: false }, function (err, body) {
        if (err) {
          logger.error(`could not unsubscribe : ${email} : ${err} : ${body}`)
        }
        else {
          logger.debug(`unsubscribed : ${email}`)
        }
      })
  }

  const sub = function (email) {
    mailgun
      .lists(`users@${process.env.MAILGUN_DOMAIN}`)
      .members(email)
      .update({ subscribed: true }, function (err, body) {
        if (err) {
          logger.error(`could not subscribe : ${email} : ${err} : ${body}`)
        }
        else {
          logger.debug(`subscribed : ${email}`)
        }
      })
  }

  resolve({
    onboard: newJoined,
    unsubscribe: unsub,
    subscribe: sub,
  })
})

