const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Tienda = require("./tienda");

const  Agente = db.sequelize.define('AGENTE', {

        ID_AGENTE: {
            type: Sequelize.STRING,
            allowNull: true,
            //autoIncrement: true

        },
        COD_POSTAL:
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
                type:Sequelize.STRING,
                allowNull:true
            },
        CALLE_PRINCIPAL_AGENTE:
            {
                type:Sequelize.STRING,
                allowNull:true
            },
        CALLE_SECUNDARIA_AGENTE:
            {
                type:Sequelize.STRING,
                allowNull:true
            },
        NUM_CASA_AGENTE:
            {
                type:Sequelize.STRING,
                allowNull:true,
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
        COD_DPA:
            {
                type:Sequelize.STRING,
                allowNull:true
            },

    },
    {
        timestamps: false,
        id:false
    })

Agente.hasMany(Tienda, {foreignKey: 'ID_AGENTE', sourceKey: 'ID_AGENTE'});
Tienda.belongsTo(Agente, {foreignKey: 'ID_AGENTE', sourceKey: 'ID_AGENTE'});

module.exports = Agente;
