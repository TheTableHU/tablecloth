const nodemailer = require('nodemailer');

let mailer = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = mailer;
