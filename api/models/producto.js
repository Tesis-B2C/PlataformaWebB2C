const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Compra_Producto = require("./compra_producto");
var Comentario = require("./comentario");
var Producto_Descuento = require("./producto_descuento");
var Calificacion = require("./calificacion");
var Imagen_Producto = require("./imagen_producto");
var Variante = require("./variante");
var Producto_Categoria = require("./producto_categoria");

const Producto = db.sequelize.define('Producto', {
        ID_PRODUCTO: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        COD_PRODUCTO: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        ID_OFERTA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },

        NOMBRE_PRODUCTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

        DESCRIPCION_PRODUCTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

        DETALLE_PRODUCTO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        PRECIO_UNITARIO:
            {
                type: Sequelize.FLOAT(8, 2),
                allowNull: false
            },
        STOCK:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        MARCA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ETIQUETAS_BUSQUEDA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

    },


    {
        timestamps: false,
        //id:false
    })

//PRODUCTO - COMPRA_PRODUCTO
Producto.hasMany(Compra_Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Compra_Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Compra_Producto.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Compra_Producto.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});

//PRODUCTO - COMENTARIO
Producto.hasMany(Comentario, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Comentario, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Comentario.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Comentario.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});

//PRODUCTO - PRODUCTO_DESCUENTO
Producto.hasMany(Producto_Descuento, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Producto_Descuento, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Producto_Descuento.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto_Descuento.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});

//PRODUCTO - CALIFICACION
Producto.hasMany(Calificacion, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Calificacion, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Calificacion.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Calificacion.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});

//PRODUCTO - IMAGEN_PRODUCTO
Producto.hasMany(Imagen_Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Imagen_Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Imagen_Producto.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Imagen_Producto.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
//PRODUCTO - VARIANTE
Producto.hasMany(Variante, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Variante, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Variante.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Variante.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});

//PRODUCTO - PRODUCTO_CATEGORIA
Producto.hasMany(Producto_Categoria, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Producto_Categoria, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
Producto_Categoria.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto_Categoria.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});

module.exports = Producto;
