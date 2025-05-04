const nodemailer = require('nodemailer');

// Configure the email transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "esandergharbi392@gmail.com", 
    pass: "zdsv elwy oeqt ttxn", // Use app password, NOT your regular Gmail password
  },
});

// Function to send email notifications
const sendEmailNotification = (to, subject, text) => {
  const mailOptions = {
    from: "esandergharbi392@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('📧 Email sent:', info.response);
  });
};

// Optional: Log notifications to console
const logNotification = (message) => {
  console.log(`📢 Notification: ${message}`);
};

module.exports = {
  sendEmailNotification,
  logNotification,
};
