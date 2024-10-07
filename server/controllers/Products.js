import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import Products from "../models/productModel.js";
import Image from "../models/imageModel.js";
import Category from "../models/categoryModel.js";
import { Op } from "sequelize";
import Users from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import { imagePath } from "./Directory.js";
import UserAddress from "../models/userAddress.js";
import { listKotaKabupaten, listProvinsi } from "../config/IndonesiaProvinciesAndCity.js";

export const addProduct = async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ msg: "Tidak ada gambar yang di pilih!" });
  }

  if (!Array.isArray(req.files.image)) {
    req.files.image = [req.files.image];
  }

  if (req.files.image.length > 5) {
    return res
      .status(400)
      .json({ msg: "Maksimal gambar yang boleh di unggah sebanyak 5 gambar" });
  }

  const { name, price, stock, discount, description, category } = req.body;
  const fieldLabels = {
    name: "Nama Produk",
    price: "Harga Produk",
    description: "Deskripsi Produk",
    category: "Kategori Produk",
  }
  const requiredFields = { name, price, description, category };
  for (const key in requiredFields) {
    if (requiredFields[key] === undefined || requiredFields[key] === "") {
      const fieldLabel = fieldLabels[key]
      return res.status(400).json({ msg: `${fieldLabel} dibutuhkan!` });
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
          stock: stock || 0,
          discount: discount || 0,
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

        res.json({ msg: "Produk berhasil diunggah!" });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ msg: "Failed to upload files.", error: err.message });
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//Untuk Kamu
export const getAllProduct = async (req, res) => {
  const { publicId } = req;
  let { benchmarkId } = req.params
  if(!benchmarkId) {
    return res.status(400).json({msg: "Benchmark required"})
  }

  console.log(benchmarkId)
  if (!benchmarkId || benchmarkId === "Infinity") {
    benchmarkId = null;
  }

  try {
    const products = await Products.findAll({
      order: [['id', 'DESC']],
      attributes: ["id", "uuid", "name", "price", "discount"],
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
          include: [
            {
              model: UserAddress,
              required: true,
              as: 'addresss'
            }
          ]
        },
      ],
      where: {
        [Op.and]: [
          { user_id: { [Op.ne]: publicId ?? 0 } },
          { user_id: { [Op.not]: null } },
          ...(benchmarkId ? [{ id: { [Op.lt]: benchmarkId } }] : [])
        ],
      },
      limit: 18,
    });

    if(products.length < 1) {
      return res.status(204).json({msg: "Products not found"})
    }

    const newProducts = products.map((product) => {
      const provinceId = product.dataValues.user.dataValues.addresss[0].dataValues.provinceId
      const cityId = product.dataValues.user.dataValues.addresss[0].dataValues.cityId
      return {
        id: product.dataValues.id,
        uuid: product.dataValues.uuid,
        name: product.dataValues.name,
        price: product.dataValues.price,
        discount: product.dataValues.discount,
        thumbnail: product.dataValues.images[0].dataValues.file_name,
        owner: product.dataValues.user.dataValues.username,
        owner_avatar: product.dataValues.user.dataValues.avatar,
        province: listProvinsi.find(prov => prov.id === provinceId).name,
        city: listKotaKabupaten.find(cit => cit.provinsiId === provinceId && cit.id ===cityId).name
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

export const getProductByUuid = async(req, res) => {
  const {product_uuid} = req.params
  if(!product_uuid) {
    return res.status(400).json({msg: "product uuid required"})
  }

  try {
    const product = await Products.findOne({
      where: {uuid: product_uuid},
      attributes: ['uuid', 'name', 'description', 'price', 'stock', 'discount'],
      include: [
        {
          model: Users,
          as: 'user',
          required: true,
          attributes: ['username', 'avatar'],
          include: [
            {
              model: UserAddress,
              as: 'addresss',
              required: true
            }
          ]
        },
        {
          model: Image,
          as: 'images',
          required: true,
          attributes: ['file_name'],
        },
        {
          model: Transaction,
          as: 'transactions',
          attributes: ['uuid']
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['name']
        }
      ],
    })

    let productJSON = product.toJSON()
    const mainProvinceId = productJSON.user.addresss[0].provinceId
    productJSON.user.addresss[0].province = listProvinsi.find(prov => prov.id === mainProvinceId).name
    
    res.status(200).json(productJSON)
  } catch (error) {
    console.log(error.message)
  }

    
}

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
        res.status(200).json({ msg: `Berhasil menghapus produk` });
      });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};
