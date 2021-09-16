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
        mailMsg.subject = 'Hi' + " " + map.firstName + " " + map.lastName + ' your forgotten password';
        var msg = '';
        msg += "<HTML><BODY>";
        msg += "<H1>Hello " + map.firstName + " " + map.lastName + " </H1>";
        msg += "<P>A request has been received to change the password for your account. </p>";
        msg += "<P>Your email id : <B>" + map.email + "<B></p>";
        msg += "<P>Generate new password : <B>" + map.link + "<B></p>";
        msg += "<P>If you did not initiate this request, please contact us at Lilly’s Lauchpad Support.</p>";
        msg += "<P>Thank you,</p>";
        msg += "<P>Lilly’s Lauchpad Team</p>";
        msg += "</BODY></HTML>";
        mailMsg.message = msg;
        return mailMsg;
    }
    /**
        * Get forgot password message
        * @param {*} map 
        */
    static getCompanyForgetPasswordMessage(map) {
        var mailMsg = new MailMessage();
        mailMsg.subject = 'Hi' + " " + map.name + ' your forgotten password';
        var msg = '';
        msg += "<HTML><BODY>";
        msg += "<H1>Hello " + map.name + " </H1>";
        msg += "<P>A request has been received to change the password for your account. </p>";
        msg += "<P>Your Your Email : <B>" + map.email + "<B></p>";
        msg += "<P>Your User Name : <B>" + map.userName + "<B></p>";
        msg += "<P>Generate new password : <B>" + map.link + "<B></p>";
        msg += "<P>If you did not initiate this request, please contact us at Lilly’s Lauchpad Support.</p>";
        msg += "<P>Thank you,</p>";
        msg += "<P>Lilly’s Lauchpad Team</p>";
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