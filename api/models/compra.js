const Sequelize = require('sequelize');
var db = require("../database/db.js");

const Compra= db.sequelize.define('Compra', {
        NUM_COMPRA: {
            type: Sequelize.BIGINT,
            primaryKey:true,
             allowNull: false
        },
        ID_AGENTE: {
            type: Sequelize.BIGINT,
             allowNull: false
        },
       FECHA_COMPRA:
            {
                type: Sequelize.DATE,
                allowNull: false
            },

         CALLE_PRINCIPAL_ENTREGA:
         {
            type: Sequelize.STRING,
            allowNull: false
         },

          CALLE_SECUNDARIA_ENTREGA:
           {
                type: Sequelize.STRING,
                allowNull: false
           }
        NUMERO_CASA_ENTREGA:
           {
                type: Sequelize.STRING,
                allowNull: false
           }

    },

    {
        timestamps:false,
        //id:false
    })

module.exports = Compra;
