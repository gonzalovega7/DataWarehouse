// ------------------------------------------------------------------------------ //
//     File:       seq-conexion.js ---------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root@localhost:3306/data_warehouse', { operatorsAliases: 0 });


module.exports = sequelize;

