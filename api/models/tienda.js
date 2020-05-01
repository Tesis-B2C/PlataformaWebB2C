const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Sucursal = require("./sucursal");
var Oferta = require("./oferta");
var Opcion_Envio_Tienda = require("./opcion_envio_tienda");
const Tienda= db.sequelize.define('Tienda', {
        NUM_TIENDA: {

            type: Sequelize.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        ID_AGENTE: {

            type: Sequelize.INTEGER,
            allowNull: false
        },
       RAZON_SOCIAL:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        NOMBRE_COMERCIAL:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        LINK_PAGINA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        LINK_FACEBOOK:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        DESCRIPCION_TIENDA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        LOGO:
            {
                type: Sequelize.BLOB('long'),
                allowNull: false
            },
        BANNER:
            {
                type: Sequelize.BLOB('long'),
                allowNull: false
            },
        ESTADO_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        HORARIO_ATENCION:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TERMINOS_CONDICIONES:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps:false,
        id:false
    })

//TIENDA-SUCURSAL
Tienda.hasMany(Sucursal, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Sucursal.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

// TIENDA-OFERTA
Tienda.hasMany(Oferta, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Oferta.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});


// TIENDA-OPCION_ENVIO_TIENDA
Tienda.hasMany(Opcion_Envio_Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Opcion_Envio_Tienda.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

module.exports = Tienda;
