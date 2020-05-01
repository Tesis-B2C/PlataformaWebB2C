const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto_Categoria = require("./producto_categoria");


const Categoria = db.sequelize.define('CATEGORIA', {
        ID_CATEGORIA:
            {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,

            },
        CAT_ID_CATEGORIA:
            {
                type: Sequelize.STRING,
                allowNull: false,

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
            },
        TIPO:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    });


//CATEGORIA - PRODUCTO_CATEGORIA
Categoria.hasMany(Producto_Categoria, {foreignKey: 'ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});
Producto_Categoria.belongsTo(Categoria, {foreignKey: 'ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});

//CATEGORIA - CATEGORIA
Categoria.hasMany(Categoria,{as:'CAT',foreignKey: 'CAT_ID_CATEGORIA', sourceKey: 'ID_CATEGORIA'});
Categoria.belongsTo(Categoria, {foreignKey: 'CAT_ID_CATEGORIA',sourceKey: 'ID_CATEGORIA'});


module.exports = Categoria;
