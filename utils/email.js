const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
    // activate in email "less secure app " option
  });
  // Define the email options
  const mailOptions = {
    from: 'Kirubel Kassahun <kirubelkassahun@natours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
