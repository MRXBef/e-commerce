import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Category = db.define(
  "category",
  {
    name: {
      type: DataTypes.ENUM(
        'fashion', 
        'elektronik', 
        'kesehatan', 
        'otomotif', 
        'bayi', 
        'furniture', 
        'mainan', 
        'olahraga', 
        'perlengkapan-rumah',
        'kebutuhan-harian'
      ),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }
);

export default Category;
