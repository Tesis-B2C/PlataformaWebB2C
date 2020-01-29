const Sequelize = require('sequelize');
var db = require("../database/db.js");


const Carrito_Producto = db.sequelize.define('Carrito_Producto', {

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
        //id:false
    })

Carrito.hasMany(Carrito_Producto, {foreignKey: 'ID_CARRITO', sourceKey: 'ID_CARRITO'});
Carrito_Producto.belongsTo(Carrito, {foreignKey: 'ID_CARRITO', sourceKey: 'ID_CARRITO'});

module.exports = Carrito;
