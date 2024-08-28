import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Users from "./userModel.js";

const Products = db.define("products", {
  uuid: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
    belongsTo: Users,
    foreignKey: {
        name: 'id',
        allowNull: false
    }
});

export default Products;
