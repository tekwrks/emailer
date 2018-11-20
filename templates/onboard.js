module.exports = (name, service) => {
<<<<<<< Updated upstream
  name = name || "new member"
  service = service || "login"

  const homepageLink = "https://www.tekwrks.com"
  const startLink = "https://www.tekwrks.com"
  const unsubscribeLink = "https://www.tekwrks.com"
=======
  name = name || 'new member'
  service = service || 'login'

  const homepageLink = 'https://www.tekwrks.com'
  const startLink = 'https://www.tekwrks.com'
  const unsubscribeLink = 'https://www.tekwrks.com'
>>>>>>> Stashed changes

  const subject = 'Welcome aboard!'
  const from = 'Martin from QuackUp <martin@tekwrks.com>'

  const text = `
Welcome ${name} !

You have linked your ${service} account with QuackUp!

Visit ${startLink} to begin.

If this was not you, then check your ${service} account for unusual activity.

To unsibscribe, please visit ${unsubscribeLink}.
`

  const html = `
<!DOCTYPE html>
<html>
  <head>
  </head>

  <body style="margin: 0; font-family: 'Cabin', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';color: #6e7b8a; text-align: center;">
    <div style="margin-top: 20px;">
      <a href="${homepageLink}">
        <img src="https://www.tekwrks.com/assets/logo-color.svg" style="max-width: 150px;" />
      </a>
    </div>
    <div style="background: #fff; margin: 0 auto; max-width: 550px;">
      <p style="font-size: 1.25rem; font-weight: 200; line-height: 1.5rem;">
        Welcome ${name} !
      </p>

      <p>You have linked your ${service} account with QuackUp!</p>

      <a href="${startLink}"
         style="background: #22b8eb;
         padding: 10px 30px 10px 30px;
         margin-bottom: 20px;
         color: #fff;
         font-size: .85rem;
         text-decoration: none;
         display: inline-block;
         text-align: center;
         cursor: pointer;
         border-radius: 5px;">
        Let's start
      </a>

      <p>If this was not you, then check your ${service} account for unusual activity.</p>

    </div>

    <hr>

    <div style="font-size: 0.75rem; text-decoration: none;">
      Too much email?
      <a href="${unsubscribeLink}">
        Unsubscribe!
      </a>
    </div>
  </body>
</html>
`

  return {
    from: from,
    to: '',
    subject: subject,
    text: text,
    html: html,
  }
}

