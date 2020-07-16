const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Sucursal = db.sequelize.define('METODO_PAGO', {
        ID_METODO_PAGO: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        NUM_TIENDA: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        PORCENTAJE_DESCUENTO:
            {
                type: Sequelize.INTEGER,

            },
        NUMERO_CUENTA:
            {
                type: Sequelize.INTEGER,

            },
        TIPO_CUENTA:
            {
                type: Sequelize.STRING,

            },
        BANCO_PERTENECE:
            {
                type: Sequelize.STRING,

            },
        API_KEY_PAYPAL:
            {
                type: Sequelize.INTEGER,

            },
        PORCENTAJE_RECARGO:
            {
                type: Sequelize.STRING,

            },
        TIPO_PAGO:
            {
                type: Sequelize.STRING,

            }

    },
    {
        timestamps: false,
        id: false
    })

module.exports = Sucursal;
