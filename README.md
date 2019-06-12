# mailgun

[![Build Status](https://travis-ci.org/multiplio/mailgun.svg?branch=master)](https://travis-ci.org/multiplio/mailgun)

Mailgun email service with Mustache templates

## routes

| method | route | success | failure | comment | validated |
|:---:|:---|:---|:---|---:| :---: |
| GET | /ready | 200 'ok' | - | kubernetes ready probe | - |
| GET | /unsubscribe/:email | -> /unsubscribed | -> /unsubscribed | remove email from all lists | yes |
| GET | /subscribe/:email | 200 'Subscribed!' | 400 'missing email' | add email to subscribed list | yes |
| GET | /onboard/:email/:name | 200 'okay' | 400 'missing email' | send onboard to :email + subscribe to lists | **no** |

## env

```
PROGRAM_ALIAS=mailgun
PORT=3000

LOG_FILE=false
LOG_LEVEL=debug

MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

