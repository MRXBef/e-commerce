import db from "../config/Database.js";
import { DataTypes } from "sequelize";

const UserAddress = db.define('userAddress', {
    provinceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

export default UserAddress