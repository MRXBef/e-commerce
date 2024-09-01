import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Cart = db.define('cart', {
    uuid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

export default Cart
