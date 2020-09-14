'use strict'

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash')
const nodemailer = require('nodemailer')
const htmlToText = require('nodemailer-html-to-text').htmlToText;
//var hbs = require('nodemailer-express-handlebars');
//attach the plugin to the nodemailer transporter
const Email = require('email-templates');
const path = require("path");

module.exports = {
  provider: 'nodemailer',
  name: 'Nodemailer',

  init: (providerOptions = {}, settings = {}) => {

    const transporter = nodemailer.createTransport(providerOptions);
    transporter.use('compile', htmlToText());

    const tmplRoot = settings.tmplRoot || path.join(__dirname, 'emails');
    const tmplName = settings.tmplName || "base"
    console.log({ tmplRoot, tmplName })

    return {
      send: (options) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {}
          options.from = options.from || settings.defaultFrom
          options.replyTo = options.replyTo || settings.defaultReplyTo
          options.text = options.text || options.html
          options.html = options.html || options.text
          options.template = options.template || settings.tmplName
          options.send = options.preview ? false : true;

          const msg = [
            'from',
            'replyTo',
            'to',
            'cc',
            'bcc',
            'subject',

            'attachments'
          ]
          const message = _.pick(options, msg);
          // transporter.sendMail(_.pick(options, msg))
          //   .then(resolve)
          //   .catch(error => reject(error))

          const locals = _.defaults(options.locals, {
            name: 'Elon',
            footer: 'global'
          });

          const email = new Email({
            views: {
              root: tmplRoot
            },
            // subjectPrefix: "[DMV] ",
            message: message,

            // uncomment below to send emails in development/test env:
            send: options.send,
            preview: true,
            transport: transporter
          });

          email
            .send({

              //  template: 'dmv',
              template: options.template,
              locals
            })
            .then(response => {
              //console.dir(response, { depth: undefined })
              resolve(response)
            })
            .catch(error => reject(error))
        })
      }
    }
  }
}


