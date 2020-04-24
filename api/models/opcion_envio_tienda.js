const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Opcion_Envio_Producto = require("./opcion_envio_producto");
const Opcion_Envio_Tienda = db.sequelize.define('Opcion_Envio_Tienda', {
        ID_OPCION_ENVIO_TIENDA: {
            primaryKey: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true
        },
        NUM_TIENDA: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ID_CATALOGO_OPCION_ENVIO: {
            type: Sequelize.STRING,
            allowNull: false,
        },

    },
    {
        timestamps: false,
        id: false
    })
Opcion_Envio_Tienda.hasMany(Opcion_Envio_Producto, {foreignKey: 'ID_OPCION_ENVIO_TIENDA', sourceKey: 'ID_OPCION_ENVIO_TIENDA'});
Opcion_Envio_Producto.belongsTo(Opcion_Envio_Tienda, {foreignKey: 'ID_OPCION_ENVIO_TIENDA', sourceKey: 'ID_OPCION_ENVIO_TIENDA'});

module.exports = Opcion_Envio_Tienda;
