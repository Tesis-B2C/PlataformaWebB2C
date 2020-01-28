const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Compra_Producto = require("./compra_producto");
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
Producto.hasMany(Compra_Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Producto.hasMany(Compra_Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'})
Compra_Producto.belongsTo(Producto, {foreignKey: 'ID_PRODUCTO', sourceKey: 'ID_PRODUCTO'});
Compra_Producto.belongsTo(Producto, {foreignKey: 'COD_PRODUCTO', sourceKey: 'COD_PRODUCTO'});
module.exports = Producto;
