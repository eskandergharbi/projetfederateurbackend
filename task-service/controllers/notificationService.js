const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a Gmail account.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS,   // Your email password or app password
    },
});

// Function to send email notifications
const sendEmailNotification = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
};

// Function to log notifications to the console
const logNotification = (message) => {
    console.log(`Notification: ${message}`);
};

module.exports = {
    sendEmailNotification,
    logNotification,
};