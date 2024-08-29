import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Users from "./userModel.js";

const Image = db.define(
  "image",
  {
    file_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    belongsTo: Users,
    foreignKey: {
      name: "id",
      allowNull: false,
    },
  }
);

export default Image;
