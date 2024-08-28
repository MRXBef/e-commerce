import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  try {
    const user = await Users.findOne({ where: { refreshToken: token } });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userID = user.id;
      const usernameSign = user.username;
      const accessToken = jwt.sign({ userID, usernameSign }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: "Internal server error"})
  }
};
