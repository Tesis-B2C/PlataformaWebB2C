const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Categoria = require("./producto_categoria");
var Categoria_Categoria = require("./categoria_categoria");

const Categoria = db.sequelize.define('Categoria', {
        ID_CATEGORIA:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        DESCRIPCION_CATEGORIA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        FECHA_CREACION_CATEGORIA:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        ESTADO_CATEGORIA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        NOMBRE:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

//CATEGORIA - PRODUCTO_CATEGORIA
Categoria.hasMany(Producto_Categoria, {foreignKey: 'ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});
Producto_Categoria.belongsTo(Categoria, {foreignKey: 'ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});

//CATEGORIA - CATEGORIA_CATEGORIA
Categoria.hasMany(Categoria_Categoria, {foreignKey: 'ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});
Categoria.hasMany(Categoria_Categoria, {foreignKey: 'CAD_ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});
Categoria_Categoria.belongsTo(Categoria, {foreignKey: 'ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});
Categoria_Categoria.belongsTo(Categoria, {foreignKey: 'CAD_ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});

module.exports = Categoria;
