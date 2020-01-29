const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Compra_Producto= db.sequelize.define('Compra_Producto', {
        ID_PRODUCTO: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        COD_PRODUCTO: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        NUM_COMPRA:
            {
                primaryKey:true,
                type: Sequelize.INTEGER,
                allowNull: false
            },

        CANTIDAD:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },

        SUB_TOTAL:
            {
                type: Sequelize.FLOAT(8,2),
                allowNull: false
            },
        SUB_TOTAL_ENVIO:
            {
                type: Sequelize.FLOAT(8,2),
                allowNull: false
            },
       FECHA_ENTREGAS:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        FECHA_ENVIO:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        ESTADO_COMPRA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }

    },

    {
        timestamps:false,
        //id:false
    })

module.exports = Compra_Producto;
