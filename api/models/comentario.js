const Sequelize = require('sequelize');
var db = require("../database/db.js");


const Comentario = db.sequelize.define('COMENTARIO', {
        ID_COMENTARIO:
            {
                type: Sequelize.BIGINT,
                autoIncrement: true,
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
        COD_AGENTE:
            {
                type: Sequelize.NUMBER,
                allowNull: false
            },
        COMENTARIO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        FECHA_COMENTARIO:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id: false
    })

module.exports = Comentario;
