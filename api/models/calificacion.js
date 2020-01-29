const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Calificacion = db.sequelize.define('Calificacion', {

        ID_CALIFICACION:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
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
        NUM_ESTRELLAS:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Calificacion;
