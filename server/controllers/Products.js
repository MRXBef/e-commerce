import path, { dirname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {v4 as uuidv4} from 'uuid'
import Products from "../models/productModel.js";
import Image from "../models/imageModel.js";
import Category from "../models/categoryModel.js";

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

  const { name, description, price, category } = req.body;
  const requiredFields = { name, description, price, category };
  for (const key in requiredFields) {
    if (requiredFields[key] === undefined || requiredFields[key] === "") {
      return res.status(400).json({ msg: `${key} are required` });
    }
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(dirname(__filename));
  const uploadPath = path.join(__dirname, "uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const images = req.files.image;
  let uploadPromises = [];
  
  let index = 1
  for(const image of images){
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
    index++
  }

  try {
    Promise.all(uploadPromises).then(async (fileNames) => {
      const insertProduct = await Products.create({
        uuid: uuidv4(),
        name: name,
        description: description,
        price: price,
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
