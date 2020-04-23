const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Producto_Imagenes_producto = db.sequelize.define('Producto_Imagenes_producto', {
        ID_IMAGEN: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        NUM_VARIANTE: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },

    },
    {
        timestamps: false,
        id: false
    })

module.exports = Producto_Imagenes_producto;
