const logger = require('./logger.js');

const MailComposer = require('nodemailer/lib/mail-composer');
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

const mailOptions = {
  from: 'Martin from QuackUp <martin@tekwrks.com>',
  to: '',
  subject: 'Welcome aboard!',
  text: 'Test email text',
  html: '<b> Test email text </b>'
};
const mail = new MailComposer(mailOptions);

module.exports = new Promise(function (resolve, reject) {
  mail.compile().build((err, message) => {
    if (err)
      reject(err);

    const msg = message.toString('ascii');
    logger.info('message compiled');

    const newJoined = function (email) {
      let dataToSend = {
        to: email,
        message: msg
      };

      mailgun.messages().sendMime(
        dataToSend,
        (sendError, body) => {
          logger.info(body);
          if (sendError)
            logger.error(sendError);
        });
    };

    resolve(newJoined);
  });
});
