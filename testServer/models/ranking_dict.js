'use strict';
module.exports = (sequelize, DataTypes) => {
  var ranking_dict = sequelize.define('ranking_dict', {
    Ranking:{
      type: DataTypes.INTEGER.UNSIGNED,
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

  return ranking_dict;
};
