const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Producto = require("./producto");
var Opcion_Envio_Producto = require("./opcion_envio_producto");
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
        OFRECE_ENVIO_LOCAL:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },

        OFRECE_ENVIO_EXTERNO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        OFRECE_RETIRO_PERSONAL:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        RESERVA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        GARANTIA:
            {
                type: Sequelize.STRING,
                allowNull: false
            }

    },
    {
        timestamps: false,
        id:false
    })

Oferta.hasOne(Producto, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
Producto.belongsTo(Oferta, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
Oferta.hasMany(Opcion_Envio_Producto, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
Opcion_Envio_Producto.belongsTo(Oferta, {foreignKey: 'ID_OFERTA', sourceKey: 'ID_OFERTA'});
module.exports = Oferta;
