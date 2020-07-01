const Sequelize = require('sequelize');
var db = require("../database/db.js");



const Imagen_Producto = db.sequelize.define('IMAGEN_PRODUCTO', {

        ID_IMAGEN:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        NUM_VARIANTE:
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


