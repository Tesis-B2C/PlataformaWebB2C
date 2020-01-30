const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Sucursal = require("./sucursal");

const Codigo_Postal = db.sequelize.define('Codigo_Postal', {

        NUM_COD_POSTAL:
            {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
        COD_DPA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

//CODIGO_POSTAL - SUCURSAL
Codigo_Postal.hasMany(Sucursal, {foreignKey: 'NUM_COD_POSTAL', sourceKey: 'NUM_COD_POSTAL'});
Sucursal.belongsTo(Codigo_Postal, {foreignKey: 'NUM_COD_POSTAL', sourceKey: 'NUM_COD_POSTAL'});

//CODIGO_POSTAL - AGENTE
Codigo_Postal.hasMany(Agente, {foreignKey: 'NUM_COD_POSTAL', sourceKey: 'NUM_COD_POSTAL'});
Agente.belongsTo(Codigo_Postal, {foreignKey: 'NUM_COD_POSTAL', sourceKey: 'NUM_COD_POSTAL'});

module.exports = Codigo_Postal;
