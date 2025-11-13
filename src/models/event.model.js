export default (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referrer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: "events",
    underscored: true,
    timestamps: true,
  });

  return Event;
};
