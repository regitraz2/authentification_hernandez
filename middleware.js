import jwt from "jsonwebtoken";

export const logged = (req, res, next) => {
    const authHeader = req.headers['Authorization'];
    if (!authHeader) return res.json("No session").status(403);
    if (!authHeader) return res.json("No token").status(403);
    try {
        const verifToken = jwt.verify(authHeader, process.env.JWT_SECRET);
        if (verifToken)
            next();
        else
            res.redirect('/').status(403);
    }
    catch (err) {
        res.redirect('/').status(403);
    }
}