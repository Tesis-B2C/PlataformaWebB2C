const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Horario_Atencion = db.sequelize.define('HORARIO_ATENCION', {

        ID_HORARIO_ATENCION:
            {
                primaryKey: true,
                type:Sequelize.BIGINT,
                allowNull:false,
                autoIncrement:true
            },
        NUM_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        DIA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        INICIO_JORNADA1:
            {
                type: Sequelize.TIME,
                allowNull: false
            },
        FIN_JORNADA1:
            {
                type: Sequelize.TIME,
                allowNull: false
            },
        INICIO_JORNADA2:
            {
                type: Sequelize.TIME,
                allowNull: true
            },
        FIN_JORNADA2:
            {
                type: Sequelize.TIME,
                allowNull: true
            }
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Horario_Atencion;
