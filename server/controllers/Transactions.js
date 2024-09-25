import Products from "../models/productModel.js";
import jwt from "jsonwebtoken";

export const createBuyNowToken = async (req, res) => {
  const { productUuid } = req.body;
  if(!productUuid) {
    return res.status(404).json({ msg: "Produk uuid dibutuhkan" });
  }
  try {
    const product = await Products.findOne({
      where: { uuid: productUuid },
      attributes: { exclude: ["id", "createdAt", "updatedAt", "description"] },
    });
    if (!product) {
      return res.status(404).json({ msg: "Produk tidak ditemukan!" });
    }

    const payload = {
      productData: {...product.toJSON()},
      buyerId: req.userID
    }

    const buyNowToken = jwt.sign(
      payload,
      process.env.BUYNOW_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    
    res.cookie("buyNow", buyNowToken, {
        httpOnly: true,
        maxAge: (24 * 7) * 60 * 60 * 1000,
        //secure: true,
        //sameSite: 'none'
  
        //un-comment 2 list di atas jika menggunakan https
    })
    
    res.sendStatus(200)
  } catch (error) {
    console.log(error.message);
  }
};
