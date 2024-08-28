import { Sequelize } from "sequelize"
import dotenv from 'dotenv'
import pg from 'pg'

//### POSTGRES  MODE
// dotenv.config()
// const db = new Sequelize(process.env.PSQL, {
//     dialect: "postgres",
//     protocol: "postgres",
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthrorized: false
//         }
//     },
//     logging: false,
//     dialectModule: pg
// })


//### DEVELOPMENT MODE
const db = new Sequelize('db_name', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+08:00'

})

export default db