import express, { json } from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./router/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import formParser from 'express-fileupload'

//import table
import Users from "./models/userModel.js";
import Products from "./models/productModel.js";
import Image from "./models/imageModel.js";
import Category from "./models/categoryModel.js";
import Transaction from "./models/transactionModel.js";

//import associations
import defineAssociations from "./models/associations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

try {
  await db.authenticate();
  console.log("database connected");
  
  defineAssociations()
  await db.sync({force: true});
} catch (error) {
  console.log("error: " + error);
}

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser());
app.use(json());
app.use(formParser())
app.use(router);

app.listen(PORT, () => {
  console.log(`app listen at port ${PORT}`);
});
