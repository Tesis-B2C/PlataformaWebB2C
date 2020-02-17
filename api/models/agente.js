const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Tienda = require("./tienda");

const  AGENTE = db.sequelize.define('AGENTE', {

        ID_AGENTE: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        NUM_COD_POSTAL:
            {
                type: Sequelize.STRING,
                allowNull: false
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
                type:Sequelize.INTEGER,
                allowNull:false
            },
        CALLE_PRINCIPAL_AGENTE:
            {
                type:Sequelize.STRING,
                allowNull:false
            },
        CALLE_SECUNDARIA_AGENTE:
            {
                type:Sequelize.STRING,
                allowNull:false
            },
        NUM_CASA_AGENTE:
            {
                type:Sequelize.STRING,
                allowNull:false,
            },
        CORREO:
            {
                primaryKey: true,
                type:Sequelize.STRING,
                allowNull:false
            },
        TIPO:
            {
                type:Sequelize.STRING,
                allowNull:false
            },
        ESTADO:
            {
                type:Sequelize.INTEGER,
                allowNull:false
            },
        CONTRASENIA:
            {
                type:Sequelize.STRING,
                allowNull:false
            },
    },
    {
        timestamps: false,
        id:false
    })

AGENTE.hasMany(Tienda, {foreignKey: 'ID_AGENTE', sourceKey: 'ID_AGENTE'});
Tienda.belongsTo(AGENTE, {foreignKey: 'ID_AGENTE', sourceKey: 'ID_AGENTE'});

module.exports = AGENTE;
