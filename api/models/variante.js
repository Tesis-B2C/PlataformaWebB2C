const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Variante = db.sequelize.define('Variante', {
        NUM_VARIANTE:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false
            },
        ID_PRODUCTO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        COD_PRODUCTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        COLOR:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TALLA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        MATERIAL:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Variante;
