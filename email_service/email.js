// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

exports.send = (body) => {
  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Message object
    const message = {
      from: 'Adidas newsletter subscription <newsletter@adidas.com>',
      to: `${body.firstName} <${body.email}>`,
      subject: body.subscribe
        ? 'Welcome to Adidas newsletter'
        : 'Goodbye from Adidas newsletter',
      text: body.subscribe
        ? `Hello ${body.firstName}! Welcome to Adidas newsletter!`
        : `Goodbye ${body.firstName}! See you soon!`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
};
