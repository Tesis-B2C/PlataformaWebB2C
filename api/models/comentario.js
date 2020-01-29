const Sequelize = require('sequelize');
var db = require("../database/db.js");


const Comentario = db.sequelize.define('Comentario', {

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
        COMENTARIO:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps: false,
        //id:false
    })



module.exports = Comentario;
