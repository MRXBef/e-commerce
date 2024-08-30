import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Category = db.define(
  "category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
);

export default Category;
