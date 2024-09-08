import express from "express";
import { register, getUserData, login, logout, getUserAvatar } from "../controllers/Users.js";
import verifyToken from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { addProduct, getAllProduct, getProductImage } from "../controllers/Products.js";
import getPublicId from "../middleware/getPublicId.js";

const router = express.Router();

//auth
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);

//token
router.get("/token", refreshToken);

//users
router.get("/user", verifyToken, getUserData);
router.get('/user/avatar/:filename', getUserAvatar)

//products
router.post('/product', verifyToken, addProduct)
router.get('/product/', getPublicId, getAllProduct)
router.get('/product/image/:filename', getProductImage)

export default router;
