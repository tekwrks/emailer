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
const express = require('express');
const app = express();

require('./email.js')
  .then((sender) => {
    app.get('/:email/:name', function (req, res) {
      if(req.params.email) {
        sender(req.params.email, req.params.name);
      }
      res.send('okay');
    });

    app.listen(process.env.PORT, () => logger.info(`listening on ${process.env.PORT}`));
  })
  .catch((err) => {
    logger.error(err);
    process.exit(0);
  });
