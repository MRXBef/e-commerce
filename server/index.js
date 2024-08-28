import express, {json} from 'express'
import dotenv from 'dotenv'
import db from './config/Database.js'
import Users from './models/userModel.js'
import router from './router/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

try {
    await db.authenticate()
    console.log('database connected')

    await db.sync()
} catch (error) {
    console.log('error: ' + error)
}

app.use(cors())
app.use(cookieParser())
app.use(json())
app.use(router)

app.listen(PORT, () => {console.log(`app listen at port ${PORT}`)})