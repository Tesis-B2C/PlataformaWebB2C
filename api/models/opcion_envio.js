const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Opcion_Envio = db.sequelize.define('OPCION_ENVIO', {
        ID_OPCION_ENVIO:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement:true
            },
        NUM_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        TIPO_ENVIO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TIPO_UBICACION:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        TIPO_MEDIDA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        HORA_ESTIMADA_RETIRO:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        INSTRUCCION_RETIRO:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        MINIMO:
            {
                type: Sequelize.FLOAT,
                allowNull: true
            },
        MAXIMO:
            {
                type: Sequelize.FLOAT,
                allowNull: true
            },
        PRECIO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: true
            }
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Opcion_Envio;
