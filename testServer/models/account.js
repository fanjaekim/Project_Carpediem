'use strict';
module.exports = (sequelize, DataTypes) => {
  var account = sequelize.define('account', {
    userID: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    userPW: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt:{
      type: DataTypes.STRING
    }
  });

  return account;
};
