import express from "express";
import { register, getUsers, login, logout } from "../controllers/Users.js";
import verifyToken from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { addProduct, getAllProduct, getProductThumbnail } from "../controllers/Products.js";

const router = express.Router();

//auth
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/users", getUsers);

//token
router.get("/token", refreshToken);

//products
router.post('/product', addProduct)
router.get('/product', getAllProduct)
router.get('/product/:filename', getProductThumbnail)

export default router;
