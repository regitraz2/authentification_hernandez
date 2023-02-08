import jwt from 'jsonwebtoken';
import {UserModel} from "../models/user.js";
import {hashPassword} from "../utils/utils.js";


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
export function logout(req, res){
    req.session.destroy();

    return res.redirect('/');
}


