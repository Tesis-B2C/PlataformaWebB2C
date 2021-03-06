const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Tienda = require("./tienda");
const Carrito = require('../models/carrito');
const Compra = require('../models/compra');
const Comentario = require('../models/comentario');
const Calificacion = require('../models/calificacion');
const Notificacion = require('../models/notificacion');

const Agente = db.sequelize.define('AGENTE', {
        COD_AGENTE: {
            primaryKey: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true
        },
        ID_AGENTE: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '000000'
            //autoIncrement: true
        },
        NUM_COD_POSTAL:
            {
                type: Sequelize.STRING,
                allowNull: true
                //references:'COD_POSTAL',
                //referencesKey:'NUM_COD_POSTAL'
            },
        NOMBRE:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

        TELEFONO:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        CALLE_PRINCIPAL_AGENTE:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        CALLE_SECUNDARIA_AGENTE:
            {
                type: Sequelize.STRING,
                allowNull: true
            },
        NUM_CASA_AGENTE:
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
        CORREO:
            {

                type: Sequelize.STRING,
                allowNull: false
            },
        TIPO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        ESTADO:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        CONTRASENIA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        COD_DPA:
            {
                type: Sequelize.STRING,
                allowNull: true
            },

    },
    {
        timestamps: false,
        id: false
    })

Agente.hasMany(Tienda, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Tienda.belongsTo(Agente, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Agente.hasOne(Carrito, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Carrito.belongsTo(Agente, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Agente.hasMany(Compra, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Compra.belongsTo(Agente, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});


Agente.hasMany(Comentario, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Comentario.belongsTo(Agente, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Agente.hasMany(Calificacion, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});
Calificacion.belongsTo(Agente, {foreignKey: 'COD_AGENTE', sourceKey: 'COD_AGENTE'});


Agente.hasMany(Notificacion, {foreignKey: 'AGENTE_EMISOR', sourceKey: 'COD_AGENTE'});
Notificacion.belongsTo(Agente, {foreignKey: 'AGENTE_EMISOR', sourceKey: 'COD_AGENTE'});

/*Agente.hasMany(Notificacion, {as:'RECEPTOR',foreignKey: 'AGENTE_RECEPTOR', sourceKey: 'COD_AGENTE'});*/
/*Notificacion.belongsTo(Agente, {as:'RECEPTOR',foreignKey: 'AGENTE_RECEPTOR', sourceKey: 'COD_AGENTE'});*/


module.exports = Agente;
