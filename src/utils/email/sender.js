//the library to connect with google gmail
const gmailSender = require('gmail-send');
//the config file
const config = require(__base + 'config');
//error handler
const errHandler = require(__base + 'utils/errors');

/**
 * basic function to send email by gmail SMTP
 * @param {string} recipient email of recipient
 * @param {string} subject
 * @param {string} htmlText email content
 */
async function sendMail(recipient, subject, htmlText) {
    
    let send;
    try {
        //initialization the sender
        let send = gmailSender({
            //var send = require('../index.js')({
            // Your GMail account used to send emails
            user: config.google.google_gmail,
            // Application-specific password
            pass: config.google.google_gmail_pwd,

            from: config.google.google_gmail,
            // recipient
            to: recipient,

            // you also may set array of recipients:
            // to : [ 'user1@gmail.com', 'user2@gmail.com' ]

            // replyTo: by default undefined,
            // bcc: 'some-user@mail.com',

            subject: subject,
            // Plain text
            //text: 'gmail-send example 1',
            // HTML text
            html: htmlText,
        });
        //send email
        send({}, function (err, res) {
        //if there is the error
        if (err) {
            throw errHandler.createBadImplementationError(err);
        }
    });

    }
    catch (err) {
        console.log(err);
        throw errHandler.createBadImplementationError(err);
    }



}

module.exports = sendMail;