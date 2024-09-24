import express from "express";
import { register, getUserData, login, logout, getUserAvatar, changeAvatarProfile } from "../controllers/Users.js";
import verifyToken from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { addProduct, deleteProduct, getAllProduct, getProductByUuid, getProductImage } from "../controllers/Products.js";
import getPublicId from "../middleware/getPublicId.js";
import { handleAddCart } from "../controllers/Carts.js";
import { createBuyNowToken } from "../controllers/Transactions.js";

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
router.post('/user/avatar', verifyToken, changeAvatarProfile)

//products
router.post('/product', verifyToken, addProduct)
router.delete('/product/:uuid', verifyToken, deleteProduct)
router.get('/product/', getPublicId, getAllProduct)
router.get('/product/:product_uuid', getProductByUuid)
router.get('/product/image/:filename', getProductImage)

//carts
router.post('/cart', verifyToken, handleAddCart)

//transactions
router.post("/transaction", verifyToken, createBuyNowToken)


export default router;
