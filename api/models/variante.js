const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Imagen_Producto = require("./imagen_producto");
const Variante = db.sequelize.define('VARIANTE', {
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
                allowNull: true
            },
        TALLA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        MATERIAL:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        PRECIO_UNITARIO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        STOCK:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        MEDIDA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ESTADO_VARIANTE:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Variante;
//PRODUCTO - IMAGEN_PRODUCTO
Variante.hasMany(Imagen_Producto, {foreignKey: 'NUM_VARIANTE', sourceKey: 'NUM_VARIANTE'});
Imagen_Producto.belongsTo(Variante, {foreignKey: 'NUM_VARIANTE', sourceKey: 'NUM_VARIANTE'});

