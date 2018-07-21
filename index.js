// read dotenv
let r = require('dotenv').config();

// setup logger
const logger = require('./logger.js');

// handle dotenv error
if (r.error) {
  logger.error(r.error);
  logger.info('could not parse dotenv');
}
else
  logger.info('parsed dotenv succesfully');

// requires
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

mail.compile().build((err, message) => {
  if (err) {
    logger.error(err);
    process.exit(0);
  }
  logger.info('message compiled');

  let dataToSend = {
    to: 'toman.martin@live.com',
    message: message.toString('ascii')
  };

  mailgun.messages().sendMime(
    dataToSend,
    (sendError, body) => {
      logger.info(body);
      if (sendError)
        logger.error(sendError);
    });
});
