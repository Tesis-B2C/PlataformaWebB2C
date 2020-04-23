const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Opciones_Envio = db.sequelize.define('Opciones_Envio', {
        ID_OPCION_ENVIO: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ID_OFERTA: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        TIPO_ENVIO: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false
        },
       DESCRIPCION_ENVIO: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false
        },
        PRECIO_ENVIO: {
            primaryKey: true,
            type: Sequelize.NUMBER,
            allowNull: false
        },

    },
    {
        timestamps: false,
        id: false
    })

module.exports = Opciones_Envio;
