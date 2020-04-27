const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Imagen_Producto = require("./producto_imagen_producto");
const Variante = db.sequelize.define('Variante', {
        NUM_VARIANTE:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement:true
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
Variante.hasMany(Producto_Imagen_Producto, {foreignKey: 'NUM_VARIANTE', sourceKey: 'NUM_VARIANTE'});
Producto_Imagen_Producto.belongsTo(Variante, {foreignKey: 'NUM_VARIANTE', sourceKey: 'NUM_VARIANTE'});

