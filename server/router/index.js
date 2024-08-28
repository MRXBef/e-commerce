import express from "express"
import { register, getUsers, login, logout } from "../controllers/Users.js"
import verifyToken from "../middleware/verifyToken.js"
import { refreshToken } from "../controllers/refreshToken.js"

const router = express.Router()

//auth
router.post('/register', register)
router.post('/login', login)
router.delete('/logout', logout)
router.get('/users', getUsers)

//token
router.get('/token', refreshToken)

export default router