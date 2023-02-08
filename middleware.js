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