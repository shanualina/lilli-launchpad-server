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
    timezone: '+05:30', // for writing to database
}
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;
db.roleModel = require("./role.model")(sequelize, Sequelize);
db.superAdminModel = require("./superAdmin.model")(sequelize, Sequelize);
db.permissionModel = require("./permission.model")(sequelize, Sequelize);
module.exports = db;