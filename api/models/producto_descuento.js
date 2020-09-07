const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Producto_Descuento = db.sequelize.define('PRODUCTO_DESCUENTO', {

        ID_DESCUENTO: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey:true,
        },
        ID_PRODUCTO:
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey:true,
            },
        COD_PRODUCTO:
            {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey:true,
            },
        FECHA_ASIGNACION_DESCUENTO:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },

    },
    {
        timestamps:false,
        id:false
    })

module.exports = Producto_Descuento;
