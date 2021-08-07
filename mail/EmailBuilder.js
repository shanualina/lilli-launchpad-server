var MailMessage = require('./MailMessage');

/**
 * Email builder creates email messages for application. 
 */

class EmailBuilder {
    /**
     * Get signup message 
     */
    static getUserRegisterUpMessage(map) {
        var mailMsg = new MailMessage();
        mailMsg.subject = 'Hi' + " " + map.NAME + ' Welcome to People’s Astro';
        var msg = '';
        msg += "<HTML><BODY>";
        msg += "<p>This is really exciting. We’re so lucky to have you. </p>";
        msg += "<p>We are here to help and make sure you get the results as excepted from People’s Astro, so don’t hesitate to reach out with questions to our astrologers we’d love to hear from you. </p>"
        msg += "<P>To help you get started we recommend you to recharge your wallet as per your need and go ahead with the calling to astrologer of your choice. </p>";
        msg += "<P>Looking forward to hear from you, </p>";
        msg += "<P>People’s Astro Team <BR>";
        msg += "<H1>Your username is!! " + map.USERNAME + " </H1>";
        msg += "<P><B>Your password is: " + map.PASSWORD + "<BR>"
        msg += "</BODY></HTML>";
        mailMsg.message = msg;
        return mailMsg;
    }


    /**
     * Get forgot password message
     * @param {*} map 
     */
    static getForgetPasswordMessage(map) {
        var mailMsg = new MailMessage();
        mailMsg.subject = 'Hi' + " " + map.NAME + ' your forgotten password';
        var msg = '';
        msg += "<HTML><BODY>";
        msg += "<H1>Hello " + map.NAME + " </H1>";
        msg += "<P>A request has been received to change the password for your People’s Astro account. </p>";
        msg += "<P>Set a new password : <B>" + map.PASSWORD + "<B></p>";
        msg += "<P>If you did not initiate this request, please contact us at People’s Astro Support.</p>";
        msg += "<P>Thank you,</p>";
        msg += "<P>People’s Astro Team</p>";
        msg += "</BODY></HTML>";
        mailMsg.message = msg;
        return mailMsg;
    }

    /**
     * Get Changepassword message
     * @param {*} map 
     */
    static getChangePasswordMessage(map) {

        var mailMsg = new MailMessage();

        mailMsg.subject = 'Hi' + " " + map.NAME + ' your password is changed!!';

        var msg = '';
        msg += "<HTML><BODY>";
        msg += "<H1>Your Password has been changed Successfully !! " + map.adminName + "</H1>";

        msg += "<P><B>To access account user Login Id : " +
            map.admiEmail + "<BR>" + " Password : " +
            map.adminPass + "</B></p>";
        msg += "</BODY></HTML>";

        mailMsg.message = msg;

        return mailMsg;
    }


    /**
     * Get getContactMessage message
     * @param {*} map 
     */
   
   


  
}
//Export to module 
module.exports = EmailBuilder;