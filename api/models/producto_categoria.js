const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Producto_Categoria = db.sequelize.define('Producto_Categoria', {
        ID_PRODUCTO: {
            primaryKey:true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        COD_PRODUCTO: {
            primaryKey:true,
            type: Sequelize.STRING,
            allowNull: false
        },
        ID_CATEGORIA:
            {
                primaryKey:true,
                type: Sequelize.INTEGER,
                allowNull: false
            }
    },
    {
        timestamps:false,
        id:false
    })

module.exports = Producto_Categoria;
