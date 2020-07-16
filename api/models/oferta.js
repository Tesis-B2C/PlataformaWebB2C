const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto = require("./producto");
const Oferta = db.sequelize.define('OFERTA', {

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

        IVA:
            {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue:0
            },
        FECHA_CREACION:
            {
                type: Sequelize.DATEONLY,
                allowNull: false
            },


        GARANTIA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ESTADO_OFERTA:
            {
                type: Sequelize.STRING,
                allowNull: false
            }

    },
    {
        timestamps: false,
        id: false
    })

Oferta.hasOne(Producto, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
Producto.belongsTo(Oferta, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
module.exports = Oferta;
