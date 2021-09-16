module.exports = (sequelize, Sequelize) => {
    const siteSettingModel = sequelize.define("siteSetting", {
        siteLogo: {
            type: Sequelize.TEXT
        },
        faviConIcon: {
            type: Sequelize.TEXT
        },
        payPalClientId: {
            type: Sequelize.TEXT
        },
        payPalclientSecret: {
            type: Sequelize.TEXT
        },
        notificationKey: {
            type: Sequelize.TEXT
        },
        footerCopyRight: {
            type: Sequelize.TEXT
        },
        faceBookLink:{
            type: Sequelize.TEXT
        },
        youTubeLink:{
            type: Sequelize.TEXT
        },
        linkedinLink:{
            type: Sequelize.TEXT
        },
        twitterLink:{
            type: Sequelize.TEXT
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return siteSettingModel;
};