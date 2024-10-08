import Users from "../models/userModel.js";
import jwt, { decode } from "jsonwebtoken";

//this function for auth token refreshing
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(200).json({ accessToken: "", isPublicUser: true });
  }

  try {
    const user = await Users.findOne({ where: { refreshToken: token } });
    if (!user) {
      return res.status(200).json({ accessToken: "", isPublicUser: true });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(200).json({ accessToken: "", isPublicUser: true });
      }

      const userID = user.id;
      const emailSign = user.email;
      const usernameSign = user.username;
      const userAvatar = user.avatar;
      const accessToken = jwt.sign(
        { userID, emailSign, usernameSign, userAvatar },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken, isPublicUser: false });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const refreshBuyNowToken = async (req, res) => {
  const token = req.cookies.buyNow;
  if (!token) {
    return res.status(400).json({ msg: "Tidak ada token!" });
  }

  jwt.verify(token, process.env.BUYNOW_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log(decoded)

    const payload = {
      buyerId: decoded.buyerId,
      buyerProvinceId: decoded.buyerProvinceId,
      shippingCost: decoded.shippingCost,
      productData: { ...decoded.productData },
    };
    const newToken = jwt.sign(payload, process.env.BUYNOW_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ buyNowToken: newToken });
  });
};
