import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import Products from "../models/productModel.js";
import Image from "../models/imageModel.js";
import Category from "../models/categoryModel.js";
import { Op } from "sequelize";
import Users from "../models/userModel.js";
import { imagePath } from "./Directory.js";

export const addProduct = async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ msg: "Tidak ada gambar yang di unggah!" });
  }

  if (!Array.isArray(req.files.image)) {
    req.files.image = [req.files.image];
  }

  if (req.files.image.length > 5) {
    return res
      .status(400)
      .json({ msg: "Maksimal gambar yang boleh di unggah sebanyak 5 gambar" });
  }

  const { name, description, price, category, stock, discount } = req.body;
  const requiredFields = { name, description, price, category };
  for (const key in requiredFields) {
    if (requiredFields[key] === undefined || requiredFields[key] === "") {
      return res.status(400).json({ msg: `${key} dibutuhkan!` });
    }
  }

  if (discount > 1)
    return res.status(400).json({ msg: "Diskon tidak boleh lebih dari 100%" });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(dirname(__filename));
  const uploadPath = path.join(__dirname, "uploads/product-image");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const images = req.files.image;
  let uploadPromises = [];

  let index = 1;
  for (const image of images) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(image.mimetype)) {
      return res.status(400).json({
        msg: `Tipe tidak sesuai untuk nama file '${image.name}', hanya JPEG, JPG, dan PNG tipe file yang boleh di unggah!`,
      });
      break;
    }

    const fileName = `image_${Date.now()}_${req.userID}${index}.${
      image.mimetype.split("/")[1]
    }`;
    const filePath = path.join(uploadPath, fileName);
    uploadPromises.push(
      new Promise((resolve, reject) => {
        image.mv(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(fileName);
          }
        });
      })
    );
    index++;
  }

  try {
    Promise.all(uploadPromises)
      .then(async (fileNames) => {
        const insertProduct = await Products.create({
          uuid: uuidv4(),
          name: name,
          description: description,
          price: price,
          stock: stock ?? 0,
          discount: discount ?? 0,
          user_id: req.userID,
        });

        for (const filename of fileNames) {
          await Image.create({
            file_name: filename,
            product_id: insertProduct.dataValues.id,
          });
        }

        const categories = category.split(",");
        for (const cat of categories) {
          await Category.create({
            name: cat,
            product_id: insertProduct.dataValues.id,
          });
        }

        res.json({ message: "Produk berhasil diunggah!" });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ message: "Failed to upload files.", error: err.message });
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getAllProduct = async (req, res) => {
  const { publicId } = req;

  try {
    const products = await Products.findAll({
      attributes: ["uuid", "name", "price", "discount"],
      include: [
        {
          model: Image,
          required: true,
          as: "images",
          attributes: ["file_name"],
        },
        {
          model: Users,
          required: true,
          as: "user",
          attributes: ["username", "avatar"],
        },
      ],
      where: {
        [Op.and]: [
          { user_id: { [Op.ne]: publicId ?? 0 } },
          { user_id: { [Op.not]: null } },
        ],
      },
      limit: 20,
    });

    const newProducts = products.map((product) => {
      return {
        uuid: product.dataValues.uuid,
        name: product.dataValues.name,
        price: product.dataValues.price,
        discount: product.dataValues.discount,
        thumbnail: product.dataValues.images[0].dataValues.file_name,
        owner: product.dataValues.user.dataValues.username,
        owner_avatar: product.dataValues.user.dataValues.avatar,
      };
    });

    res.status(200).json({
      msg: "Success",
      datas: newProducts,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getProductImage = (req, res) => {
  const filename = req.params["filename"];

  const image = path.join(imagePath, filename);
  if (fs.existsSync(image)) {
    res.status(200).sendFile(image);
  } else {
    res.status(404).json({ msg: "Image not found!" });
  }
};

export const deleteProduct = async (req, res) => {
  const uuid = req.params["uuid"];
  if (!uuid) return res.status(400).json({ msg: "uuid required" });

  try {
    const product = await Products.findOne({
      where: {
        [Op.and]: [{ uuid: uuid }, { user_id: req.userID }],
      },
      include: [
        {
          model: Image,
          as: "images",
        },
        {
          model: Category,
          as: "categories",
        },
      ],
    });
    if (!product) return res.status(404).json({ msg: "product not found" });

    let promises = [];
    const { images, categories } = product;

    for (const image of images) {
      const filePath = path.join(imagePath, image.dataValues.file_name);
      promises.push(
        new Promise((resolve, reject) => {
          fs.rm(filePath, (err) => {
            if (err) {
              reject(`Gagal menghapus ${image.dataValues.file_name}`);
            } else {
              resolve(`Gambar ${image.dataValues.file_name} berhasil dihapus`);
            }
          });
        })
      );
    }

    try {
      Promise.all(promises).then(async () => {
        await Category.destroy({ where: { product_id: product.id } });
        await Image.destroy({ where: { product_id: product.id } });
        await product.destroy();
        res.status(200).json({ msg: `Berhasil menghapus ${product.name}` });
      });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};
