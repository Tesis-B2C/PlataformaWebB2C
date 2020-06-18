const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Sucursal = require("./sucursal");
var Oferta = require("./oferta");
var Metodo_Pago = require("./metodo_pago");
var Opcion_Envio_Tienda = require("./opcion_envio_tienda");
var Horario_Atencion = require("./horario_atencion");

const Tienda= db.sequelize.define('TIENDA', {
        NUM_TIENDA:
            {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
        TERMINOS_CONDICIONES:
            {
                type: Sequelize.STRING,
                allowNull: false
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

// TIENDA-METODO DE PAGO
Tienda.hasMany(Metodo_Pago, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Metodo_Pago.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

// TIENDA-HORARIO_ATENCION
Tienda.hasMany(Horario_Atencion, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});
Horario_Atencion.belongsTo(Tienda, {foreignKey: 'NUM_TIENDA', sourceKey: 'NUM_TIENDA'});

module.exports = Tienda;
