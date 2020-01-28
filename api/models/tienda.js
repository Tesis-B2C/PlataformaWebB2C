const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Tienda= db.sequelize.define('Tienda', {
        NUM_TIENDA: {
<<<<<<< Updated upstream
            type: Sequelize.INTEGER,
            primaryKey:true
        },
        ID_AGENTE: {
            type: Sequelize.BIGINT,
            primaryKey:true
=======
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey:true,
            allowNull: false
        },
        ID_AGENTE: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            allowNull: false
>>>>>>> Stashed changes
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
