import jwt from "jsonwebtoken";

export function logged(req, res, next){
    if (!req.session) res.redirect('/').status(403);
    if (!req.session.token) res.redirect('/').status(403);

    try {
        const verifToken = jwt.verify(req.session.token, process.env.JWT_SECRET);

        console.log(verifToken);

        if (verifToken)
            next();
        else
            res.redirect('/').status(403);
    }
    catch (err) {
        res.redirect('/').status(403);
    }
}