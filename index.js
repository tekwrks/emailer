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
require('./email.js')
  .then((sender) => {
    sender('toman.martin@live.com');
  })
  .catch((err) => {
    logger.error(err);
    process.exit(0);
  });
