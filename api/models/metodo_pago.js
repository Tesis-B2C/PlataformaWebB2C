const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Metodo_Pago = db.sequelize.define('METODO_PAGO', {
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
                type: Sequelize.STRING,

            },
        TIPO_CUENTA:
            {
                type: Sequelize.STRING,

            },
        BANCO_PERTENECE:
            {
                type: Sequelize.STRING,

            },
        NOMBRE_BENEFICIARIO:
            {
                type: Sequelize.STRING,

            },
        CORREO_BENEFICIARIO:
            {
                type: Sequelize.STRING,

            },
        IDENTIFICACION_BENEFICIARIO:
            {
                type: Sequelize.STRING,

            },

        API_KEY_PAYPAL:
            {
                type: Sequelize.STRING,

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

module.exports = Metodo_Pago;
