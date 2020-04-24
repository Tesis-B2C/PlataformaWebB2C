const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Opcion_Envio_Tienda = require("./opcion_envio_tienda");
const Catalogo_Opcion_Envio = db.sequelize.define('Catalogo_Opcion_Envio', {
        ID_CATALOGO_OPCION_ENVIO: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false,

        },
        CAT_ID_CATALOGO_OPCION_ENVIO: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        DESCRIPCION_CATALOGO_OPCION_ENVIO: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ESTADO_CATALOGO_OPCION_ENVIO: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

    },
    {
        timestamps: false,
        id: false
    })
// Catalogo_Opcion_Envio - Opcion_Envio_Tienda
Catalogo_Opcion_Envio.hasMany(Opcion_Envio_Tienda, {foreignKey: 'ID_CATALOGO_OPCION_ENVIO', sourceKey: 'ID_CATALOGO_OPCION_ENVIO'});
Opcion_Envio_Tienda.belongsTo(Catalogo_Opcion_Envio, {foreignKey: 'ID_CATALOGO_OPCION_ENVIO', sourceKey: 'ID_CATALOGO_OPCION_ENVIO'});

//Catalogo_Opcion_Envio -Catalogo_Opcion_Envio
Catalogo_Opcion_Envio.hasMany(Catalogo_Opcion_Envio, {foreignKey: 'CAT_ID_OPCION_ENVIO_TIENDA', sourceKey: 'ID_OPCION_ENVIO_TIENDA'});
Catalogo_Opcion_Envio.belongsTo(Catalogo_Opcion_Envio, {foreignKey: 'CAT_ID_OPCION_ENVIO_TIENDA', sourceKey: 'ID_CATALOGO_OPCION_ENVIO'});
module.exports = Catalogo_Opcion_Envio;
