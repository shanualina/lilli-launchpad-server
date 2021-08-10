const express = require("express");
const app = express();
const roles = require("../controller/roleCtrl");
const superAdmin = require("../controller/superAdminCtrl");
const permission = require("../controller/permissionCtrl");
// const subUsersRoutes = require("./images");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use('/superadmin',superAdmin);
    app.use('/role',roles);
    app.use('/permission',permission);
    
    //read images
    app.use('/images', express.static('./images'));
}