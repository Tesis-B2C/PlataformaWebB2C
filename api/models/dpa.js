const Sequelize = require('sequelize');
var db = require("../database/db.js");
var Codigo_Postal = require("./codigo_postal");

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

//DPA - CODIGO_POSTAL
Dpa.hasMany(Codigo_Postal, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});
Codigo_Postal.belongsTo(Dpa, {foreignKey: 'COD_DPA', sourceKey: 'COD_DPA'});

//DPA - DPA
Dpa.hasMany(Dpa, {foreignKey: 'DPA_COD_DPA', sourceKey: 'COD_DPA'});
Dpa.belongsTo(Dpa, {foreignKey: 'DPA_COD_DPA', sourceKey: 'COD_DPA'});

module.exports = Dpa;
