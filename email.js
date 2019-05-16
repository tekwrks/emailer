const logger = require('./logger')
const templateLoader = require('./loadTemplate')

const MailComposer = require('nodemailer/lib/mail-composer')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const list = require('./list')('users')

const from = 'Martin from Cast <martin@cast.multipl.io>'

module.exports = new Promise(function (resolve, reject) {
  templateLoader('/templates/onboard')
    .then((onboardTemplate) => {
      const newJoined = function (email, name) {
        const subject = 'Welcome aboard!'
        const view = {
          name: name || 'new member',
          service: 'twitter',
          homepageLink: 'https://cast.multipl.io',
          startLink: 'https://cast.multipl.io',
          unsubscribeLink: 'https://cast.multipl.io/unsubscribe/' + email,
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

      // return prepared functions
      resolve({
        onboard: newJoined,
      })
    })
    .catch(e => reject(e))
})

