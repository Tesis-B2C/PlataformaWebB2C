const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Compra_Producto = require("./compra_producto");

const Compra= db.sequelize.define('Compra', {
        NUM_COMPRA: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey:true,
            allowNull: false
        },
        ID_AGENTE: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        FECHA_COMPRA:
            {
                type: Sequelize.DATE,
                allowNull: false
            },

        CALLE_PRINCIPAL_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

        CALLE_SECUNDARIA_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

        NUMERO_CASA_ENTREGA:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },


    {
        timestamps:false,
        id:false
    })
Compra.hasMany(Compra_Producto, {foreignKey: 'NUM_COMPRA', sourceKey: 'NUM_COMPRA'});
Compra_Producto.belongsTo(Compra, {foreignKey: 'NUM_COMPRA', sourceKey: 'NUM_COMPRA'});
module.exports = Compra;
