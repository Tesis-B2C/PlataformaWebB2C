const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Producto_Descuento = db.sequelize.define('Producto_Descuento', {
        ID_PRODUCTO_DESCUENTO: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ID_DESCUENTO: {
            type: Sequelize.INTEGER,
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
        FECHA_ASIGNACION_DESCUENTO:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        ESTADO_ASIGNACION_DESCUENTO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }
    },
    {
        timestamps:false
    })

module.exports = Producto_Descuento;
