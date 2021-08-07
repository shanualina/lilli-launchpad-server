//Import Node Mailer module
var nodemailer = require('nodemailer');
var system = require('./system.js');
var MailMessage = require('./MailMessage');
var EmailBuilder = require('./EmailBuilder');

/**
 * EmailService class providing email services
 */

class EmailService {

    /**
     * Constructor of class
     */
    constructor() {
        console.log('--->' + system.mail.auth.user);
        this.serverConfig = {
            host: system.mail.service,
            auth: {
                user: system.mail.auth.user,
                pass: system.mail.auth.password
            },
            tls: {
                rejectUnauthorized: false
            }
        }
        console.log(  this.serverConfig)
    }

    /**
     * Send Email 
     * @param {*} mailMessage 
     * @param {*} callback reported by error or response 
     */
    sendEmail(mailMessage, callback) {
        console.log(callback)
        var email = {
            from: system.mail.user,
            to: mailMessage.to,
            subject: mailMessage.subject,
            html: mailMessage.message
        };
        //Transporter to send email
        var transporter = nodemailer.createTransport(this.serverConfig);
        //Send email
        transporter.sendMail(email, function(error, info) {
            callback(error, info);
            console.log(error,'err');
            console.log(info,'info');
        });
    }
}

//Export to module 
module.exports = EmailService;
// MAIL_MAILER=smtp
// MAIL_HOST=smtp.gmail.com
// MAIL_PORT=465
// MAIL_USERNAME=developer.anoopkumar@gmail.com
// MAIL_PASSWORD=yamaqiggkwvcwhzx
// MAIL_ENCRYPTION=ssl
