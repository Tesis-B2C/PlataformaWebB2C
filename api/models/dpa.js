const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Agente = require("./agente.js");
var Sucursal =require("./sucursal.js");
var Compra =require("./compra.js");

const Dpa = db.sequelize.define('DPA', {
        COD_DPA:
            {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false
            },
        DPA_COD_DPA:
            {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        NOMBRE:
            {
                type: Sequelize.STRING,
                allowNull: false
            },
        TIPO:
            {
                type: Sequelize.STRING,
                allowNull: false
            }
    },
    {
        timestamps: false,
        id:false
    })

//DPA - Agente
Dpa.hasMany(Agente, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});
Agente.belongsTo(Dpa, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});

//DPA - Sucursal
Dpa.hasMany(Sucursal, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});
Sucursal.belongsTo(Dpa, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});

//DPA - DPA
Dpa.hasMany(Dpa, {foreignKey: 'DPA_COD_DPA', sourceKey: 'COD_DPA'});
Dpa.belongsTo(Dpa, {as:'DPAP',foreignKey: 'DPA_COD_DPA', sourceKey: 'COD_DPA'});

//DPA - COMPRA
Dpa.hasMany(Compra, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});
Compra.belongsTo(Dpa, {as:'DPAP',foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});
module.exports = Dpa;
