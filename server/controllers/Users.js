import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid'

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
    const username = `user_${uuidv4().split('-')[0]}`
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
    const accessToken = jwt.sign(
      { userId, emailSign, usernameSign },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );
    const refreshToken = jwt.sign(
      { userId, emailSign, usernameSign },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Users.update(
      { refreshToken: refreshToken },
      {
        where: { id: userId },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
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

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.status(200).json({
      ...users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};
