'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('result_lists', {
      Name:{
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      Hierarchy:{
        type: Sequelize.STRING(20),
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('result_lists');
  }
};
