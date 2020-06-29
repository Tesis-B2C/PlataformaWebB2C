const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Imagenes_Producto = require("./producto_imagen_producto");


const Imagen_Producto = db.sequelize.define('IMAGEN_PRODUCTO', {

        ID_IMAGEN:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
                type: Sequelize.STRING,
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

