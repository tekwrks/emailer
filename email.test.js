// read dotenv
let r = require('dotenv').config();

// require emailer
let email = null;
beforeAll(() => {
  email = require('./email.js');
  return email;
});

test('compiles email message', () => {
  console.log(email);
  expect(email).toBeTruthy();
});
