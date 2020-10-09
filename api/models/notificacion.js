const Sequelize = require('sequelize');
var db = require("../database/db.js");


const Notificacion = db.sequelize.define('NOTIFICACION', {
        ID_NOTIFICACION:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        AGENTE_EMISOR:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        AGENTE_RECEPTOR:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        ENVIAR_A:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ASUNTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        MENSAJE:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
        ,
        CODIGO_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        ,
        CODIGO_COMPRA:
            {
                type: Sequelize.INTEGER,
                allowNull: true
            }


    },
    {
        timestamps: false,
        id: false
    })


module.exports = Notificacion;
