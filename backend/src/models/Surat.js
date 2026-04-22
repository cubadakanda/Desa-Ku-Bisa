import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Surat = sequelize.define(
    "Surat",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      jenisSurat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keperluan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "proses", "selesai"),
        defaultValue: "pending",
        allowNull: false,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
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
      tableName: "surat",
      timestamps: true,
    }
  );

  return Surat;
};
