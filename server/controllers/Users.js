import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import Products from "../models/productModel.js";
import Image from "../models/imageModel.js";
import UserRelation from "../models/userRelation.js";
import Cart from "../models/cartModel.js";

export const register = async (req, res) => {
  const { email, password, confPassword } = req.body;
  if (!email || !password || !confPassword) {
    return res.status(400).json({ msg: "Semua kolom wajib di isi!" });
  }
  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan konfirmasi password harus sama!" });
  }

  try {
    const user = await Users.findOne({ where: { email: email } });
    if (user) {
      return res.status(409).json({ msg: "email telah digunakan!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const username = `${email.split("@")[0]}${uuidv4().split("-")[0]}`;
    await Users.create({
      username: username,
      email: email,
      role: "user",
      password: hashPassword,
      balance: 0,
    });
    return res.status(200).json({ msg: "Berhasil membuat akun" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Semua kolom wajib diisi!" });
  }

  try {
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ msg: "Email tidak ditemukan!" });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(403).json({ msg: "Password salah!" });
    }

    const userId = user.id;
    const usernameSign = user.username;
    const emailSign = user.email;
    const userAvatar = user.avatar;
    const accessToken = jwt.sign(
      { userId, emailSign, usernameSign, userAvatar },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId, emailSign, usernameSign, userAvatar },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await Users.update(
      { refreshToken: refreshToken },
      {
        where: { id: userId },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: (24 * 7) * 60 * 60 * 1000,
      //secure: true,
      //sameSite: 'none'

      //un-comment 2 list di atas jika menggunakan https
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.sendStatus(400);
  }
  try {
    const user = await Users.findOne({ where: { refreshToken: refreshToken } });
    if (!user) {
      return res.sendStatus(403);
    }

    await Users.update({ refreshToken: null }, { where: { id: user.id } });
    res
      .clearCookie("refreshToken")
      .status(200)
      .json({ msg: "Berhasil keluar!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};

export const getUserAvatar = async (req, res) => {
  const filename = req.params["filename"];
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(dirname(__filename));
  const avatar = path.join(__dirname, "uploads/user-avatar", filename);
  if (fs.existsSync(avatar)) {
    res.status(200).sendFile(avatar);
  } else {
    res.status(404).json({ msg: "avatar not found" });
  }
};

export const getUserData = async (req, res) => {
  const { username } = req;
  try {
    const user = await Users.findOne({
      attributes: ["username", "email", "balance", "avatar"],
      where: {
        username: username,
      },
      include: [
        {
          model: Products,
          required: false,
          as: "products",
          include: [
            {
              model: Image,
              required: false,
              as: "images",
            },
          ],
        },
        {
          model: UserRelation,
          required: false,
          as: "followings",
        },
        {
          model: UserRelation,
          required: false,
          as: "followeds",
        },
        {
          model: Cart,
          required: false,
          as: "carts",
        },
      ],
      order: [[{ model: Products, as: "products" }, 'createdAt', 'DESC']],
    });

    res.status(200).json({ ...user.dataValues });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};

export const changeAvatarProfile = async (req, res) => {
  const { image } = req.files;
  if (!image) return res.status(400).json({ msg: "Kamu harus mengunggah gambar!" });
  const { userFilename } = req.body;
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(image.mimetype)) {
    return res
      .status(400)
      .json({ msg: "Gambar harus bertipe jpg, jpeg atau png" });
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(dirname(__filename));
  const uploadPath = path.join(__dirname, "uploads/user-avatar");

  if(!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
  }

  try {
    const user = await Users.findOne({
      where: { username: req.username },
    });
    if (fs.existsSync(path.join(uploadPath, userFilename))) {
      user.avatar = null;
      await user.save();
      fs.rmSync(path.join(uploadPath, userFilename));
    }

    const fileName = `image_${Date.now()}_${req.userID}.${
      image.mimetype.split("/")[1]
    }`;
    image.mv(path.join(uploadPath, fileName), async (err) => {
      if (err) console.log(err);
      user.avatar = fileName;
      await user.save();

      res.status(200).json({ msg: "Berhasil ubah profil" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
