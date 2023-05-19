'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      attributes: {
        type: Sequelize.JSONB
      },
      data: {
        type: Sequelize.STRING
      },
      messageId: {
        type: Sequelize.STRING
      },
      publishTime: {
        type: Sequelize.DATE
      },
      subscription: {
        type: Sequelize.STRING
      },
      operationType: {
        type: Sequelize.STRING
      },
      transactionId: {
        type: Sequelize.INTEGER
      },
      sourceBank: {
        type: Sequelize.INTEGER
      },
      sourceAccount: {
        type: Sequelize.INTEGER
      },
      destinationBank: {
        type: Sequelize.INTEGER
      },
      destinationAccount: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};