import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const UserRelation = db.define('user_relation', {
    uuid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    followed_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    following_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
})

export default UserRelation