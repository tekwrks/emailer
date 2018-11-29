const logger = require('./logger')
const templateLoader = require('./loadTemplate')

const MailComposer = require('nodemailer/lib/mail-composer')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const list = require('./list')('users')

module.exports = new Promise(function (resolve, reject) {
  templateLoader('/templates/onboard')
    .then((onboardTemplate) => {
      const newJoined = function (email, name) {
        const from = 'Martin from QuackUp <martin@tekwrks.com>'
        const subject = 'Welcome aboard!'
        const view = {
          name: name || 'new member',
          service: 'twitter',
          homepageLink: 'https://www.tekwrks.com',
          startLink: 'https://www.tekwrks.com',
          unsubscribeLink: 'https://www.tekwrks.com',
        }

        const rendered = onboardTemplate(view)
        const mail = new MailComposer({
          from: from,
          to: '',
          subject: subject,
          text: rendered.plain,
          html: rendered.html,
        }).compile()

        mail.build((err, message) => {
          if (err) {
            logger.error(`could not compile email : ${err}`)
            return
          }
          logger.debug('message compiled')

          // send the onboarding email
          let dataToSend = {
            to: email,
            message: message.toString('ascii'),
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
        list.add(members, true)
      }

      resolve({
        onboard: newJoined,
      })
    })
    .catch(e => reject(e))
})

