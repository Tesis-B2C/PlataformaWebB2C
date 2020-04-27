const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Opcion_Envio_Producto = db.sequelize.define('Opcion_Envio_Producto', {
        ID_OPCION_ENVIO_PRODUCTO: {
            primaryKey: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true
        },
        ID_OFERTA: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },
        TIPO_ENVIO_PRODUCTO: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false
        },
        DESCRIPCION_ENVIO_PRODUCTO: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false
        },
        PRECIO_ENVIO_PRODUCTO: {
            primaryKey: true,
            type: Sequelize.NUMBER,
            allowNull: false
        },
        TIEMPO_ESTIMADO_ENTREGA_PRODUCTO: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false
        },

    },
    {
        timestamps: false,
        id: false
    })

module.exports = Opcion_Envio_Producto;
