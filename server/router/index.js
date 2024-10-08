import express from "express";
import { register, getUserData, login, logout, getUserAvatar, changeAvatarProfile } from "../controllers/Users.js";
import verifyToken from "../middleware/verifyToken.js";
import { refreshBuyNowToken, refreshToken } from "../controllers/RefreshToken.js";
import { addProduct, deleteProduct, getForYouProduct, getProductByUuid, getProductImage } from "../controllers/Products.js";
import getPublicId from "../middleware/getPublicId.js";
import { handleAddCart } from "../controllers/Carts.js";
import { createBuyNowToken } from "../controllers/Transactions.js";
import { getCities, getProvincies } from "../controllers/Location.js";

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
router.get('/product/foryou/:benchmarkId', getPublicId, getForYouProduct)
router.get('/product/:product_uuid', getProductByUuid)
router.get('/product/image/:filename', getProductImage)

//carts
router.post('/cart', verifyToken, handleAddCart)

//transactions
router.post("/transaction", verifyToken, createBuyNowToken)
router.get('/transaction/token', refreshBuyNowToken)

//location
router.get('/location/provincies', getProvincies)
router.get('/location/cities/:provincieId', getCities)


export default router;
