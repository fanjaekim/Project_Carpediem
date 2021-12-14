'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tag_lists', {
      Main: {
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      Sub: {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tag_lists');
  }
};
