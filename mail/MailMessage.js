/**
 * Contains Mail message attributes
 */
 class MailMessage {
    constructor() {
        this.to = '';
        this.cc = '';
        this.bcc = '';
        this.subject = '';
        this.message = '';
        this.html = false;
    };

    addTo(to) {
        this.to += "," + to;
    }

    addCC(cc) {
        this.cc += "," + cc;
    }

    addBCC(bcc) {
        this.bcc += "," + bcc;
    }

}

module.exports = MailMessage;