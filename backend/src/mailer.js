const nodemailer = require('nodemailer');
const path = require('path'); // Add path module

async function createMailer() {
  const { default: hbs } = await import('nodemailer-express-handlebars');

  let mailer = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  mailer.use('compile', hbs({
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.resolve(__dirname, 'views'), // Use absolute path
      layoutsDir: path.resolve(__dirname, 'views'),  // Use absolute path
      defaultLayout: 'email',
    },
    viewPath: path.resolve(__dirname, 'views'),  // Use absolute path
    extName: '.hbs',
  }));

  return mailer;
}

module.exports = createMailer();
