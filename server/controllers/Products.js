import path, { dirname } from "path";
import fs from "fs";
import Products from "../models/productModel.js";

export const addProduct = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  const {name, description, price, category} = req.body
  
  res.status(200).json({
    message: "File upload successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
};

