'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('copy_lists', {
      Name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      Ranking:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('copy_lists');
  }
};
