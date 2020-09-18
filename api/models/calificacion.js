const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Calificacion = db.sequelize.define('CALIFICACION', {
        ID_CALIFICACION:
            {
                primaryKey: true,
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
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
        NUM_ESTRELLAS:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        FECHA_CALIFICACION:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id: false
    })

module.exports = Calificacion;
