'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resultado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  resultado.init({
    banco1: DataTypes.INTEGER,
    banco2: DataTypes.INTEGER,
    monto: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'resultado',
  });
  return resultado;
};