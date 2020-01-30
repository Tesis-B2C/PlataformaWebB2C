const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto = require("./producto");

const Oferta = db.sequelize.define('Oferta', {

        ID_OFERTA:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        NUM_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        ID_AGENTE:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        IVA:
            {
                type: Sequelize.FLOAT,
                allowNull: false
            },
        FECHA_CREACION:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
        NUM_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        OFRECE_ENVIO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        PRECIO_ENVIO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }

    },
    {
        timestamps: false,
        id:false
    })

Oferta.hasOne(Producto, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
Producto.belongsTo(Oferta, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});

module.exports = Oferta;
