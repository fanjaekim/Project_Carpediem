'use strict';
module.exports = (sequelize, DataTypes) => {
  var copy_list = sequelize.define('copy_list', {
    Name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
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

  return copy_list;
};
