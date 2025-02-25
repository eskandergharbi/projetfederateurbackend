const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a Gmail account.
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
      auth: {
        user: "esandergharbi392@gmail.com", // Your email address
        pass: "wcjh wdjn voys brpr",  
         // Your email password or app password
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