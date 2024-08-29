import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Users from "./userModel.js";

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
  },
  {
    belongsTo: Users,
    foreignKey: {
      name: "id",
      allowNull: false,
    },
  }
);

export default Category;
