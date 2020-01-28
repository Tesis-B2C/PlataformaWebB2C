const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Tienda = require("./tienda")
const Agente = db.sequelize.define('Agente', {

        ID_AGENTE: {
            type: Sequelize.BIGINT,
<<<<<<< Updated upstream
            primaryKey: true
=======
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
>>>>>>> Stashed changes
        },
        NUM_COD_POSTAL:
            {
                type: Sequelize.STRING,
                //references:'COD_POSTAL',
                //referencesKey:'NUM_COD_POSTAL'
            },
        NOMBRE:
            {
                type: Sequelize.STRING,
                allowNull: false
            },

        APELLIDO:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        CEDULA:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TELEFONO:
            {
                type:Sequelize.INTEGER,
                allowNull:false
            },
        CALLE_PRINCIPAL:
            {
                type:Sequelize.STRING,
                allowNull:false
            },
        CALLE_SECUNDARIA:
            {
                type:Sequelize.STRING,
                allowNull:false
            },
        CORREO:
            {
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


    },

    {
        timestamps: false,
        //id:false
    })
Agente.hasMany(Tienda, {foreignKey: 'ID_AGENTE', sourceKey: 'ID_AGENTE'});
Tienda.belongsTo(Agente, {foreignKey: 'ID_AGENTE', sourceKey: 'ID_AGENTE'});
module.exports = Agente;
