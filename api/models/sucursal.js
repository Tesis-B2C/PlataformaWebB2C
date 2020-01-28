const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Sucursal= db.sequelize.define('Sucursal', {
        NUM_SUCURSAL: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey:true,
            allowNull: false
        },
        NUM_TIENDA: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        NUM_COD_POSTAL:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ID_AGENTE:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        CALLE_PRINCIPAL_SUCURSAL:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        CALLE_SECUNDARIA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TELEFONO_SUCURSAL:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        RUC:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps:false,
        //id:false
    })

module.exports = Sucursal;
