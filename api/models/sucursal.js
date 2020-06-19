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

            },
        NUM_REFERENCIA:
            {
                type: Sequelize.STRING,

            },

        DIRECCION_SUCURSAL:
            {
                type: Sequelize.STRING,

            },

        TELEFONO_SUCURSAL:
            {
                type: Sequelize.STRING,

            },
        RUC:
            {
                type: Sequelize.STRING,

            },
        COD_DPA:
            {
                type: Sequelize.STRING,

            },
        HORARIO_ATENCION:
            {
                type: Sequelize.STRING,

            },
        LATITUD:
            {
                type: Sequelize.STRING,

            },
        LONGITUD:
            {
                type: Sequelize.STRING,

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
