require('dotenv').config()
var system = {
    mail: {
        port:  process.env.eport,
        service: process.env.eservice,
        secure: true, // use TLS
        auth: {
            user:process.env.euser,
            password:process.env.epassword
        }
    }
}

module.exports = system;