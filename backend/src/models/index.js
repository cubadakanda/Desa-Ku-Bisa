import { Sequelize } from "sequelize";
import config from "../config/database.js";
import UserModel from "./User.js";
import SuratModel from "./Surat.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
});

const User = UserModel(sequelize);
const Surat = SuratModel(sequelize);

// Relationships
User.hasMany(Surat, { foreignKey: "userId", as: "surat" });
Surat.belongsTo(User, { foreignKey: "userId", as: "user" });

export const db = {
  sequelize,
  User,
  Surat,
};

export default db;
