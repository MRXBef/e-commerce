import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Transaction = db.define("transaction", {
  uuid: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order_status: {
    type: DataTypes.ENUM('processing', 'completed'),
    allowNull: false,
    defaultValue: 'processing'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_arrived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

export default Transaction;
