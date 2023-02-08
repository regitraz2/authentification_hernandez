import jwt from "jsonwebtoken";

export const logged = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers);
    if (!authHeader) return res.json("No session").status(403);
    if (!authHeader) return res.json("No token").status(403);
    try {
        const verifToken = jwt.verify(authHeader, process.env.JWT_SECRET);
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
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin === false) {
      return res.status(401).json({
        message: 'You are not authorized to access this resource'
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
};

