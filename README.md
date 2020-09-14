# strapi-provider-email-nodemailer

This release of the nodemailer provider for Strapi is compatible with Strapi 3.x

## Installation

```bash
npm i strapi-provider-email-nodemailer-tmpl
```

## Configuration

In your **config/plugins.js** file:
```js
module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.example.com'),
      port: env('SMTP_PORT', 587),
      auth: {
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD'),
      }
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: 'hello@example.com',
      defaultReplyTo: 'hello@example.com',
      //absolute path where templates are stored
      tmplRoot: path.join(__dirname, 'emails'),
      tmplName: 'base'
    }
  }
});
```

Check out the available options for nodemailer: https://nodemailer.com/about/

### Development mode

You can override the default configurations for specific environments. E.g. for
`NODE_ENV=development` in **config/env/development/plugins.js**:
```js
module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
    },
  },
});
```
The above setting is useful for local development with
[maildev](https://github.com/maildev/maildev).

### Custom authentication mechanisms

It is also possible to use custom authentication methods.
Here is an example for a NTLM authentication: 
```js
const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');

module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.example.com'),
      port: env('SMTP_PORT', 587),
      auth: {
        type: 'custom',
        method: 'NTLM',
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD')
      },
      customAuth: {
        NTLM: nodemailerNTLMAuth
      }
    },
    settings: {
      defaultFrom: 'hello@example.com',
      defaultReplyTo: 'hello@example.com',
    }
  }
});
```

## Usage

To send an email from anywhere inside Strapi:
```js
await strapi.plugins['email'].services.email.send({
    to: 'someone@example.com',
    from: 'someone2@example.com',
    subject:  'Hello world',
    text:  'Hello world',
    html:  `<h4>Hello world</h4>`
  });
```   

The following fields are supported:

| Field  | Description |
| ------------- | ------------- |
| from | Email address of the sender|
| to | Comma separated list or an array of recipients |
| replyTo | Email address to which replies are sent |
| cc | Comma separated list or an array of recipients |
| bcc | Comma separated list or an array of recipients |
| subject | Subject of the email |
| text | Plaintext version of the message |
| html | HTML version of the message |
| attachments | Array of objects See: https://nodemailer.com/message/attachments/ |

## Troubleshooting

Check your firewall to ensure that requests are allowed. If it doesn't work with 
```js
port: 465,
secure: true
```
try using
```js
port: 587,
secure: false
```
to test if it works correctly.

## Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)

## Resources

- [MIT License](LICENSE.md)
