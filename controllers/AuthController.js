import fs from "fs"
import jwt from 'jsonwebtoken';
import {UserModel} from "../models/user.js";
import crypto from "crypto";
import {registerForm} from "../views/registerForm.js";
import {validateUser} from "../validations/AuthValidations.js";
import bcrypt from "bcrypt"

export async function login(req, res){

    const user = await UserModel.findOne({email: req.body.email });
    if(!user){
        return res.send("User not find")
    }

    if(await hashPassword(req.body.password,user.password)){
        const token = jwt.sign(
            { userId: user.id , role: user.role, email:user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        req.session.token = token;
        
        return res.json({token:req.session.token,user:user});
    }else{
        return res.send("Password invalid");
    }

}

export async function getUser(req,res){





    
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

export async function hashPassword(password,hash) {
  const verif = await bcrypt.compare(password, hash);
  return verif
}

export async function randomUser(req, res){
    const excludeEmail = req.session.token ? jwt.verify(req.session.token, process.env.JWT_SECRET).email : null;
    const user = await UserModel.aggregate([
        { $match: { email: { $ne: excludeEmail } } },
        { $sample: { size: 1 } }
      ]);
      
    return res.json(user[0]);
}