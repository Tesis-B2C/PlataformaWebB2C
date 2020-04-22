const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Imagenes_Producto = require("./producto_imagenes_producto");
const Variante = db.sequelize.define('Variante', {
        NUM_VARIANTE:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
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
        COLOR:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TALLA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        MATERIAL:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        PRECIO_UNITARIO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Variante;
//PRODUCTO - IMAGEN_PRODUCTO
Variante.hasMany(Producto_Imagenes_Producto, {foreignKey: 'NUM_VARIANTE', sourceKey: 'NUM_VARIANTE'});
Producto_Imagenes_Producto.belongsTo(Variante, {foreignKey: 'NUM_VARIANTE', sourceKey: 'NUM_VARIANTE'});

