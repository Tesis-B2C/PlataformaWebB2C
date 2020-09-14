const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Compra_Producto = db.sequelize.define('COMPRA_PRODUCTO', {
        NUM_VARIANTE: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        NUM_COMPRA:
            {
                primaryKey: true,
                type: Sequelize.INTEGER,
                allowNull: false
            },

        CANTIDAD_PRODUCTO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        PRECIO_UNITARIO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        TOTAL_PRODUCTOS:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        IMPUESTOS:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        PORCENTAJE_IMPUESTO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        SUBTOTAL:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },

        DESCUENTOS:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        PORCENTAJE_AUTOMATICO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        CUPON:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        PORCENTAJE_CUPON:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        IMAGEN_MOSTRAR: {
            type: Sequelize.STRING,
            allowNull: false
        }


    },

    {
        timestamps: false,
        id: false
    })

module.exports = Compra_Producto;
