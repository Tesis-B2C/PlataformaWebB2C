const Sequelize = require('sequelize');
var db = require("../database/db.js");


const Carrito_Producto = db.sequelize.define('CARRITO_PRODUCTO', {

        ID_PRODUCTO:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,

            },
        COD_PRODUCTO:
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
            }
    },
    {
        timestamps: false,
        id:false
    })



module.exports = Carrito_Producto;
