var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
module.exports = function (sequelize, DataTypes) {
  var url = sequelize.define('url', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    hash:{
       type: DataTypes.STRING,
       allowNull: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url:{
      type: DataTypes.STRING,
      allowNull: true
    },
    // date:{
    //   type: DataTypes.DATE,
    //   allowNull: true
    // },
     description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  },
    {
      tableName: 'url',
      timestamps: true,
      getterMethods: { },
      classMethods: { }
    })
  return url
}
