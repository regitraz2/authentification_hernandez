import jwt from "jsonwebtoken";
import {UserModel} from "./models/user.js";

export const logged = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.json("No Token Received");

    try {
        const verifToken = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (verifToken) {
            req.authUser = (await UserModel.findOne({_id: verifToken.userId}));
            next();
        }
        else
            console.log("Token invalid")
    }
    catch (err) {
        console.log(err)
    }
}

export const checkAdmin = (req, res, next) => {
  try {
    if (req.authUser.isAdmin === false) {
      return res.json({
        message: 'You are not authorized to access this resource'
      });
    }

    next();

  } catch (error) {
      console.log(error)
    return res.json({
      message: 'Auth failed'
    });
  }
};
