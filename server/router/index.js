import express from "express";
import upload from "../middleware/multer.js";
import { register, getUsers, login, logout } from "../controllers/Users.js";
import verifyToken from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { addProduct } from "../controllers/Products.js";

const router = express.Router();

//auth
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/users", getUsers);

//token
router.get("/token", refreshToken);

//products
router.post('/product', upload.single('image'), (err, req, res, next) => {
    if(err) return res.status(400).json({msg: "Only image files allowed to upload"})
        next()
}, addProduct)

export default router;
