import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Users = db.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refreshBuyNowToken: {
    type: DataTypes.TEXT
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Users;
