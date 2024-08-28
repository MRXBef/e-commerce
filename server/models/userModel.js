import { DataTypes } from "sequelize"
import db from "../config/Database.js"

const Users = db.define(
    'users',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.TEXT
        }
    }
)

export default Users