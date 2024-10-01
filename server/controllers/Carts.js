import { Op } from "sequelize";
import Cart from "../models/cartModel.js";
import Products from "../models/productModel.js";
import { v4 as uuidv4 } from "uuid";

export const handleAddCart = async (req, res) => {
  const { productUuid, productOwner } = req.body;
  if (!productUuid || !productOwner) {
    return res.status(400).json({ msg: "Data produk diperlukan!" });
  }

  if (req.username === productOwner) {
    return res.status(400).json({
      msg: "Anda tidak bisa menambahkan produk anda sendiri ke dalam keranjang!",
    });
  }

  try {
    const isProductExists = await Products.findOne({
      where: { uuid: productUuid },
      raw: true,
      attributes: ["id"],
    });
    if (!isProductExists) {
      return res.status(404).json({ msg: "Produk tidak ditemukan!" });
    }

    const isCartIsExists = await Cart.findOne({
      where: {
        [Op.and]: [{ product_id: isProductExists.id }, { user_id: req.userID }],
      },
    });
    if (isCartIsExists) {
      return res
        .status(409)
        .json({ msg: "Produk tersebut sudah ada di dalam keranjang anda!" });
    }

    await Cart.create({
      uuid: uuidv4(),
      product_id: isProductExists.id,
      user_id: req.userID,
    });

    res
      .status(200)
      .json({ msg: "Berhasil menambahkan produk ini ke keranjang anda" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
