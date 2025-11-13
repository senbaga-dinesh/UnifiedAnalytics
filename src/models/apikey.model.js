export default (sequelize, DataTypes) => {
  const ApiKey = sequelize.define("ApiKey", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    appName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "api_keys",
    underscored: true,
    timestamps: true, // adds created_at, updated_at
  });

  return ApiKey;
};
