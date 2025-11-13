import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

import ApiKeyModel from "./apikey.model.js";
import EventModel from "./event.model.js";

const db = {};

db.sequelize = sequelize;
db.ApiKey = ApiKeyModel(sequelize, DataTypes);
db.Event = EventModel(sequelize, DataTypes);

// Optionally, define relationships (1 API key → many events)
db.ApiKey.hasMany(db.Event, { foreignKey: "apiKey", sourceKey: "apiKey" });
db.Event.belongsTo(db.ApiKey, { foreignKey: "apiKey", targetKey: "apiKey" });

export default db;
