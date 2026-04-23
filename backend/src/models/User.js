import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nik: {
        type: DataTypes.STRING(16),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dusun: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("aktif", "mutasi", "nonaktif"),
        defaultValue: "aktif",
        allowNull: false,
      },
      jenisKelamin: {
        type: DataTypes.ENUM("Laki-laki", "Perempuan"),
        defaultValue: "Laki-laki",
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "warga"),
        defaultValue: "warga",
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
