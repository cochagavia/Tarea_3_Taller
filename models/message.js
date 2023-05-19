'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Message.init({
    attributes: DataTypes.JSONB,
    data: DataTypes.STRING,
    messageId: DataTypes.STRING,
    publishTime: DataTypes.DATE,
    subscription: DataTypes.STRING,
    operationType: DataTypes.STRING,
    transactionId: DataTypes.INTEGER,
    sourceBank: DataTypes.INTEGER,
    sourceAccount: DataTypes.INTEGER,
    destinationBank: DataTypes.INTEGER,
    destinationAccount: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};