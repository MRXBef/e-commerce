import path, { dirname } from "path";
import fs from "fs";
import Products from "../models/productModel.js";

export const addProduct = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
  if(req.fileError) return res.status(400).json({msg: "Only image files can be upload"})
  res.status(200).json({
    message: "File upload successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
};
