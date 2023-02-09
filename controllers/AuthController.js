import jwt from 'jsonwebtoken';
import {UserModel} from "../models/user.js";
import {verifyPassword} from "../utils/utils.js";


export async function login(req, res){

    const user = await UserModel.findOne({email: req.body.email });
    if(!user){
        return res.status(404).json({"message":"Cet utilisateur n'existe pas"});
    }

    if(await verifyPassword(req.body.password,user.password)){
        const token = jwt.sign(
            { userId: user.id , role: user.role, email:user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        req.session.token = token;
        
        return res.json({token:req.session.token,user:user});
    }else{
        return res.status(403).json({"message":"Mot de passe incorrect"});
    }
}
export function logout(req, res){
    req.session.destroy();

    return res.redirect('/');
}


