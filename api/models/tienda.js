const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Sucursal = require("./sucursal");
var Oferta = require("./oferta");
var Metodo_Pago = require("./metodo_pago");
var Horario_Atencion = require("./horario_atencion");
var Opcion_Envio = require("./opcion_envio");

const Tienda = db.sequelize.define('TIENDA', {
        NUM_TIENDA:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
        COD_AGENTE:
            {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        CORREO_TIENDA: {
            type: Sequelize.STRING,
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
                allowNull: true
            },
        LINK_FACEBOOK:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        DESCRIPCION_TIENDA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        LOGO:
            {
                type: Sequelize.BLOB('long'),
                allowNull: true
            },
        BANNER:
            {
                type: Sequelize.BLOB('long'),
                allowNull: true
            },
        ESTADO_TIENDA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        TERMINOS_CONDICIONES:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        CORREO_TIENDA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        HORARIO_ATENCION:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        CONTACTO_WHATSAPP:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id: false
    })

//TIENDA-SUCURSAL
Tienda.hasMany(Sucursal, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Sucursal.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

// TIENDA-OFERTA
Tienda.hasMany(Oferta, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Oferta.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});


// TIENDA-METODO DE PAGO
Tienda.hasMany(Metodo_Pago, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Metodo_Pago.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

// TIENDA-HORARIO_ATENCION
Tienda.hasMany(Horario_Atencion, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Horario_Atencion.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

// TIENDA-OPCION_ENVIO
Tienda.hasMany(Opcion_Envio, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Opcion_Envio.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

module.exports = Tienda;
