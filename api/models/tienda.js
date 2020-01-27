const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Tienda= db.sequelize.define('Tienda', {
        NUM_TIENDA: {
            type: Sequelize.INTEGER,
            primaryKey:true
        },
        ID_AGENTE: {
            type: Sequelize.BIGINT,
            primaryKey:true
        },
       RAZON_SOCIAL:
            {
                type: Sequelize.STRING,

            },

    },

    {
        timestamps:false,
        //id:false
    })

module.exports = Tienda;
