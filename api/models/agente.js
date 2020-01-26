const Sequelize = require('sequelize');
const db = require("../database/db.js");

module.exports = db.sequelize.define('Agente', {

        ID_AGENTE: {
            type: Sequelize.BIGINT,
            primaryKey:true
        },
        NUM_COD_POSTAL:
            {
                type: Sequelize.STRING,
                references:'person',
                referencesKey:'id'
            },

    },

    {
        timestamps:false,
        id:false
    })
