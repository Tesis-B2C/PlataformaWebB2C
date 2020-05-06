const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Unidad_Medida = db.sequelize.define('UNIDAD_MEDIDA', {
        COD_UNIDAD_MEDIDA: {
            primaryKey: true,
            type: Sequelize.STRING,
            allowNull: false,

        },
        UNI_COD_UNIDAD_MEDIDA: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        DESCRIPCION_UNIDAD_MEDIDA: {
            type: Sequelize.STRING,
            allowNull: false
        },


    },
    {
        timestamps: false,
        id: false
    })
// Unidad_Medida - Unidad_Medida
Unidad_Medida.hasMany(Unidad_Medida, {foreignKey: 'UNI_COD_UNIDAD_MEDIDA', sourceKey: 'COD_UNIDAD_MEDIDA'});
Unidad_Medida.belongsTo(Unidad_Medida, {foreignKey: 'UNI_COD_UNIDAD_MEDIDA', sourceKey: 'COD_UNIDAD_MEDIDA'});


module.exports = Unidad_Medida;
