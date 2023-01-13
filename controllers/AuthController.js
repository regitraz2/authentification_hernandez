import fs from "fs"
import jwt from 'jsonwebtoken';
import {UserModel} from "../models/user.js";
import crypto from "crypto";
import {registerForm} from "../views/registerForm.js";
import {validateUser} from "../validations/AuthValidations.js";

export async function login(req, res){
    const user = await UserModel.findOne({email: req.body.email });

    if(user.password === hashPassword(req.body.password)){
        const token = jwt.sign(
            { userId: user.id , role: user.role, email:user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        req.session.token = token;

        return res.redirect('/dashboard');
    }

    res.redirect('/');
}
export async function register(req, res){
    const isValidated = await validateUser(req, res);
    if (!isValidated) return;

    const result = await UserModel.insertMany({firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: hashPassword(req.body.password)});

    if(result)
        return res.redirect('/');
    return res.redirect('/register');
}
export function logout(req, res){
    req.session.destroy();

    return res.redirect('/');
}
export function getLoginForm(req, res){
    return res.send(fs.readFileSync("./views/loginForm.html").toString());
}

export function getRegisterForm(req, res){
    return res.send(registerForm(req));
}

export function hashPassword(password) {
    const sha256Hasher = crypto.createHash('sha256', process.env.JWT_SECRET);
    return sha256Hasher.update(password).digest("hex");
}