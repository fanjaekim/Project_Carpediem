'use strict';
module.exports = (sequelize, DataTypes) => {
  var result_list = sequelize.define('result_list', {
    Name:{
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    Hierarchy:{
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  },
  //option
  {
      timestamps: false
  });

  return result_list;
};
