const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Imagenes_Producto = require("./producto_imagenes_producto");


const Imagen_Producto = db.sequelize.define('Imagen_Producto', {

        ID_IMAGEN:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
        NOMBRE_IMAGEN:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TIPO_IMAGEN:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        IMAGEN:
            {
                type: Sequelize.BLOB('long'),
                allowNull: false
            },
        TAMANIO_IMAGEN:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
    },
    {
        timestamps: false,
        id:false
    })



module.exports = Imagen_Producto;
Imagen_Producto.hasMany(Producto_Imagenes_Producto, {foreignKey: 'ID_IMAGEN', sourceKey: 'ID_IMAGEN'});
Producto_Imagenes_Producto.belongsTo(Imagen_Producto, {foreignKey: 'ID_IMAGEN', sourceKey: 'ID_IMAGEN'});

