'use strict';
module.exports = (sequelize, DataTypes) => {
  var tag_list = sequelize.define('tag_list', {
    Main: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    Sub: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  },
  //option
  {
      timestamps: false
  });

  return tag_list;
};
