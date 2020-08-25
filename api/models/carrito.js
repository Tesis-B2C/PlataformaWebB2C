const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Carrito_Producto = require("./carrito_producto");

const Carrito = db.sequelize.define('CARRITO', {

        ID_CARRITO:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement:true
            },
        COD_AGENTE:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        CANTIDAD_TOTAL_PRODUCTOS:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

Carrito.hasMany(Carrito_Producto, {foreignKey: 'ID_CARRITO', sourceKey: 'ID_CARRITO'});
Carrito_Producto.belongsTo(Carrito, {foreignKey: 'ID_CARRITO', sourceKey: 'ID_CARRITO'});

module.exports = Carrito;
