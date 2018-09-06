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
const app = require('express')();

require('./email.js')
  .then(sender => {

    //send onboarding email
    app.get('/onboard/:email/:name', function (req, res) {
      if(req.params.email) {
        sender.onboard(req.params.email, req.params.name);
        res.status(200).send('okay');
      }
      else {
        logger.info('got no email address - ignoring request');
        res.status(400).send();
      }
    });

    //unsubscribe
    app.get('/unsubscribe/:email', function (req, res) {
      if(req.params.email) {
        sender.unsubscribe(req.params.email);
        res.status(200).send('okay');
      }
      else {
        logger.info('got no email address - ignoring request');
        res.status(400).send();
      }
    });

    app.listen(process.env.PORT, () => logger.info(`listening on ${process.env.PORT}`));
  })
  .catch(err => {
    logger.error(err);
    process.exit(0);
  });
