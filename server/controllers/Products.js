import path, { dirname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {v4 as uuidv4} from 'uuid'
import Products from "../models/productModel.js";
import Image from "../models/imageModel.js";
import Category from "../models/categoryModel.js";
import { Op } from "sequelize";
import Users from "../models/userModel.js";

export const addProduct = async (req, res) => {
  req.userID = 1

  if (!req.files || !req.files.image) {
    return res.status(400).json({ msg: "No file were uploaded" });
  }

  if(!Array.isArray(req.files.image)){
    req.files.image = [req.files.image]
  }

  if (req.files.image.length > 5) {
    return res.status(400).json({ msg: "Maximum images for a product is 5 files" });
  }

  const { name, description, price, category, stock, discount } = req.body;
  const requiredFields = { name, description, price, category };
  for (const key in requiredFields) {
    if (requiredFields[key] === undefined || requiredFields[key] === "") {
      return res.status(400).json({ msg: `${key} are required` });
    }
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(dirname(__filename));
  const uploadPath = path.join(__dirname, "uploads/product-image");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const images = req.files.image;
  let uploadPromises = [];
  
  images.forEach((image, index) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if(!allowedTypes.includes(image.mimetype)){
      return res.status(400).json({msg: `Invaild file type for image '${image.name}', only JPEG, JPG, and PNG files are allowed to upload`})
    }

    const fileName = `image_${Date.now()}_${index}.${image.mimetype.split('/')[1]}`
    const filePath = path.join(uploadPath, fileName)
    uploadPromises.push(new Promise((resolve, reject) => {
      image.mv(filePath, (err) => {
        if(err) {
          reject(err)
        }else {
          resolve(fileName)
        }
      })
    }))
  })

  try {
    Promise.all(uploadPromises).then(async (fileNames) => {
      const insertProduct = await Products.create({
        uuid: uuidv4(),
        name: name,
        description: description,
        price: price,
        stock: stock ?? 0,
        discount: discount ?? 0,
        user_id: req.userID
      })

      for(const filename of fileNames) {
        await Image.create({
          file_name: filename,
          product_id: insertProduct.dataValues.id
        })
      }

      const categories = category.split(',')
      for(const cat of categories) {
        await Category.create({
          name: cat,
          product_id: insertProduct.dataValues.id
        })
      }
      
      res.json({message: 'Product uploaded successfully'});
    }).catch((err) => {
      res.status(500).json({ message: 'Failed to upload files.', error: err.message });
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({msg: "Internal server error"})
  }
};

export const getAllProduct = async(req, res) => {
  const userID = 2
  try {
    const products = await Products.findAll({
      attributes: ['uuid', 'name', 'price', 'discount'],
      include: [{
        model: Image,
        required: true,
        as: 'images',
        attributes: ['file_name']
      },{
        model: Users,
        required: true,
        as: 'user',
        attributes: ['username', 'avatar']
      }],
      where: {
        [Op.not]: {
          user_id: userID
        }
      },
      limit: 20
    })

    const newProducts = products.map(product => {
      return {
        uuid: product.dataValues.uuid,
        name: product.dataValues.name,
        price: product.dataValues.price,
        discount: product.dataValues.discount,
        thumbail: product.dataValues.images[0].dataValues.file_name,
        owner: product.dataValues.user.dataValues.username,
        owner_avatar: product.dataValues.user.dataValues.avatar
      }
    })

    res.status(200).json({
      msg: "Success",
      datas: newProducts
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({msg: "Internal server error"})
  }
}

export const getProductThumbnail = (req, res) => {
  const filename = req.params['filename']
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(dirname(__filename))
  
  const image = path.join(__dirname, "uploads/product-image", filename)
  if(fs.existsSync(image)){
    res.status(200).sendFile(image)
  }else{
    res.status(404).json({msg: "Image not found!"})
  }
}
