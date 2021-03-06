const Sequelize = require('sequelize');
var db = require("../database/db.js");


const Carrito_Producto = db.sequelize.define('CARRITO_PRODUCTO', {

        NUM_VARIANTE:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,

            },

        ID_CARRITO:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,

            },

        CANTIDAD_PRODUCTO_CARRITO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },

        FECHA_CREACION_CARRITO: {
            type: Sequelize.DATE,
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


module.exports = Carrito_Producto;
