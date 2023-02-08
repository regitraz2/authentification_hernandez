import jwt from "jsonwebtoken";

export const logged = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.json("No Token Received");

    try {
        const verifToken = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (verifToken)
            next();
        else
            console.log("Token invalid")
    }
    catch (err) {
        console.log(err)
    }
}

export const checkAdmin = (req, res, next) => {
  try {
      console.log(req);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isAdmin === false) {
      return res.json({
        message: 'You are not authorized to access this resource'
      });
    }
    req.user = decoded;
    next();

  } catch (error) {
      console.log(error)
    return res.json({
      message: 'Auth failed'
    });
  }
};
