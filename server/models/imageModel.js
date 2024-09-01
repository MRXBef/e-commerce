import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Image = db.define(
  "image",
  {
    file_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
);

export default Image;
