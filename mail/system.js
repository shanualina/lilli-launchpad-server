require('dotenv').config()
var system = {
    mail: {
        port: 465,
        service: 'smtp.zoho.com',
        secure: true, // use TLS
        auth: {
            user:'info@rajivjadhav.com',
            password:'2YnH30t0xELy'
        }
    }
}

module.exports = system;