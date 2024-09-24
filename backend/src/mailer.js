const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// Configure the mail transport
let mailer = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Set up Handlebars as the template engine for nodemailer
const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./templates/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./templates/'),
  extName: '.hbs',
};

// Use the Handlebars plugin
mailer.use('compile', hbs(handlebarOptions));

module.exports = mailer;
