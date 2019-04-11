# mailgun

[![Build Status](https://travis-ci.org/multiplio/mailgun.svg?branch=master)](https://travis-ci.org/multiplio/mailgun)

Mailgun email service with Mustache templates

## routes

- GET ```/unsubscribe/:email``` <br>
unsubscibe :email + remove from mailgun lists

- GET ```/onboard/:email/:name``` <br>
send onboarding email to :email + subscribe + add to mailgun lists

## env

```
PROGRAM_ALIAS=email
PORT=3000

LOG_FILE=false
LOG_LEVEL=debug

MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

