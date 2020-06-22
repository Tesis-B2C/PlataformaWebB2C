const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Sucursal = db.sequelize.define('SUCURSAL', {
        NUM_SUCURSAL: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        NUM_TIENDA: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        NUM_COD_POSTAL_SUCURSAL:
            {
                type: Sequelize.STRING,
                allowNull:true

            },
        NUM_REFERENCIA:
            {
                type: Sequelize.STRING,
                allowNull:true

            },

        DIRECCION_SUCURSAL:
            {
                type: Sequelize.STRING,
                allowNull:true

            },

        TELEFONO_SUCURSAL:
            {
                type: Sequelize.STRING,
                allowNull:true

            },
        RUC:
            {
                type: Sequelize.STRING,
                allowNull:false
            },
        COD_DPA:
            {
                type: Sequelize.STRING,
                allowNull:true

            },

        LATITUD:
            {
                type: Sequelize.STRING,
                allowNull:true
            },
        LONGITUD:
            {
                type: Sequelize.STRING,
                allowNull:true
            },
        TIPO_SUCURSAL:{
            type:Sequelize.STRING,
            allowNull:false
        }
    },
    {
        timestamps: false,
        id: false
    })

module.exports = Sucursal;
