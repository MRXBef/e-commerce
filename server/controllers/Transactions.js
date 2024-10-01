import Products from "../models/productModel.js";
import jwt from "jsonwebtoken";

export const createBuyNowToken = async (req, res) => {
  const { productUuid, productOwner } = req.body;
  if (!productUuid || !productOwner) {
    return res.sendStatus(400);
  }

  if (req.username === productOwner) {
    return res
      .status(400)
      .json({ msg: "Anda tidak bisa membeli produk anda sendiri!" });
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
      productData: { ...product.toJSON() },
      buyerId: req.userID,
    };

    const buyNowToken = jwt.sign(payload, process.env.BUYNOW_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("buyNow", buyNowToken, {
      httpOnly: true,
      maxAge: 24 * 7 * 60 * 60 * 1000,
      //secure: true,
      //sameSite: 'none'

      //un-comment 2 list di atas jika menggunakan https
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
  }
};
