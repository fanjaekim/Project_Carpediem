'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('manage_lists', {
      Name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      Tag: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      Life: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        min: 0
      },
      Ranking:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('manage_lists');
  }
};
