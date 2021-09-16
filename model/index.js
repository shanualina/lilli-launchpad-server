const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    logging: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    },
    dialectOptions: {
        typeCast: true
    },
    timezone: '+05:30',  // for writing to database
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;
db.roleModel = require("./role.model")(sequelize, Sequelize);
db.superAdminModel = require("./superAdmin.model")(sequelize, Sequelize);
db.permissionModel = require("./permission.model")(sequelize, Sequelize);
db.employeeModel = require("./employee.model")(sequelize, Sequelize);
db.roleHashPermissionModel = require("./role_hash_permission.model")(sequelize, Sequelize);
db.chatRoomModel = require("./chatRoom.model")(sequelize, Sequelize);
db.messageModel = require("./message.model")(sequelize, Sequelize);
db.packageModel = require("./package.model")(sequelize, Sequelize);
db.projectModel = require("./project.model")(sequelize, Sequelize);
db.companyModel = require("./company.model")(sequelize, Sequelize);
db.projectGoalModel = require("./projectGoals.model")(sequelize, Sequelize);
db.projectInfoModel = require("./projectInfo.model")(sequelize, Sequelize);
db.activityLogModel = require("./activityLog.model")(sequelize, Sequelize);
db.companyTransactionModel = require("./companyTransaction.model")(sequelize, Sequelize);
db.resetPasswordToken = require("./resetPasswordToken.model")(sequelize, Sequelize);
db.siteSettingModel = require("./siteSetting.model")(sequelize, Sequelize);
db.employeeCompanyChatModel = require("./employeeCompanyChat.model")(sequelize, Sequelize);

db.goalsModel = require("./goals.model")(sequelize, Sequelize);
db.strategyModel = require("./strategy.model")(sequelize, Sequelize);
db.tacticsModel = require("./tactics.model")(sequelize, Sequelize);
db.objectivesModel = require("./objectives.model")(sequelize, Sequelize);
db.activityModel = require("./activity.model")(sequelize, Sequelize);
db.regionModel = require("./region.model")(sequelize, Sequelize);
db.taskAssignmentModel = require("./taskAssignment.model")(sequelize, Sequelize);
db.commentModel = require("./comment.model")(sequelize, Sequelize);
db.productFileModel = require("./productFileModel")(sequelize, Sequelize);
//relation to table 

db.roleHashPermissionModel.belongsTo(db.permissionModel);
db.roleHashPermissionModel.belongsTo(db.roleModel);

db.companyTransactionModel.belongsTo(db.companyModel);
db.companyTransactionModel.belongsTo(db.packageModel);

db.employeeModel.belongsTo(db.companyModel);
db.companyModel.belongsTo(db.roleModel);
db.employeeModel.belongsTo(db.regionModel);

db.employeeModel.belongsTo(db.roleModel);

// db.taskAssignmentModel.belongsTo(db.employeeModel);

db.taskAssignmentModel.belongsTo(db.employeeModel, { foreignKey: 'userId', targetKey: 'id' });

// db.commentModel.belongsTo(db.taskAssignmentModel, { foreignKey: 'taskId', targetKey: 'id' });

// db.commentModel.hasMany(db.taskAssignmentModel, { foreignKey: 'taskId' })

module.exports = db;