import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, confPassword } = req.body;
  if (!email || !password || !confPassword) {
    return res.status(400).json({ msg: "All field are required!" });
  }
  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and confirm password must be match!" });
  }

  try {
    const user = await Users.findOne({ where: { email: email } });
    if (user) {
      return res.status(409).json({ msg: "email already taken!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await Users.create({
      username: Date.now(),
      email: email,
      role: "user",
      password: hashPassword,
    });
    return res.status(200).json({ msg: "Create user successfuly!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "All field are required!" });
  }

  try {
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(403).json({ msg: "Wrong password" });
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
      .json({ msg: "Logout successfuly" });
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
