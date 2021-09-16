const express = require("express");
const app = express();
const roles = require("../controller/roleCtrl");
const superadmins = require("../controller/superAdminCtrl");
const permissions = require("../controller/permissionCtrl");
const users = require("../controller/userCtrl");
const role_hash_permissions = require("../controller/role_hash_permissionCtrl");
const chatrooms = require("../controller/chatRoomCtrl");
const messages = require("../controller/messageCtrl");
const packages = require("../controller/packageCtrl");
const companys = require("../controller/companyCtrl");
const projectGoals = require("../controller/projectGoalCtrl");
const projectInfos = require("../controller/projectInfoCtrl");
const activityLogs = require("../controller/activityLogCtrl");
const employees = require("../controller/employeeCtrl");
const companyTransactions = require("../controller/companyTransactionCtrl");
const projects = require("../controller/projectCtrl");
const goals = require("../controller/goalsCtrl");
const strategies = require("../controller/strategyCtrl");
const activitys = require("../controller/activityCtrl");
const tactics = require("../controller/tacticsCtrls");
const objectives = require("../controller/objectiveCtrl");
const regions = require("../controller/regionCtrl");
const taskAssignments = require("../controller/taskAssignmentCtrl");
const comments = require("../controller/commentCtrl");
const siteSettings = require("../controller/siteSettingCtrl");
const productFiles = require("../controller/productFileCtrl");
const test = require("../testing1");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use('/superadmin', superadmins);
    app.use('/role', roles);
    app.use('/permission', permissions);
    app.use('/user', users);
    app.use('/rolehashpermission', role_hash_permissions);
    app.use('/chatroom', chatrooms);
    app.use('/message', messages);
    app.use('/package', packages);
    app.use('/company', companys);
    app.use('/employee', employees);
    app.use('/project', projects);
    app.use('/projectgoal', projectGoals);
    app.use('/projectinfo', projectInfos);
    app.use('/activitylog', activityLogs);
    app.use('/companytransaction', companyTransactions);
    app.use('/goal', goals);
    app.use('/strategy', strategies);
    app.use('/activity', activitys);
    app.use('/tactic', tactics);
    app.use('/objective', objectives);
    app.use('/region', regions);
    app.use('/taskassignment', taskAssignments);
    app.use('/comment', comments);
    app.use('/sitesetting', siteSettings);
    app.use('/productfile', productFiles);
    
    //read images
    app.use('/images', express.static('./public/images'));
    app.use('/file', express.static('./public/file'));
}