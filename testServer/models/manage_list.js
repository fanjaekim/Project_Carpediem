'use strict';
module.exports = (sequelize, DataTypes) => {
  var manage_list = sequelize.define('manage_list', {
    Name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    Tag: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Life: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      min: 0
    },
    Ranking:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  //option
  {
      timestamps: false
  });

  return manage_list;
};
