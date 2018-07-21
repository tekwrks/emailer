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

// app requires
const api_key = process.env.MAILGUN_API_KEY;
const domain = 'mail.tekwrks.com';
const from_who = 'Martin from QuackUp <martin@tekwrks.com>';

const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: from_who,
  to: 'toman.martin@live.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

mailgun.messages().send(data, function (error, body) {
  logger.info(body);
  if (error)
    logger.error(error);
});
