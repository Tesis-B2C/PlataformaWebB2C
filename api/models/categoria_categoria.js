const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Categoria_Categoria = db.sequelize.define('Categoria_Categoria', {
        CAT_ID_CATEGORIA:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false
            },
        ID_CATEGORIA:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

module.exports = Categoria_Categoria;
