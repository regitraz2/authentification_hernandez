import {UserModel} from "../models/user.js";
import jwt from "jsonwebtoken";
import {validateUser} from "../validations/AuthValidations.js";
import {hashPassword} from "../utils/utils.js";

export async function getUser(req,res){
    const users = await UserModel.find({});
    if(!users){
        return res.status(404).json({"message":"User not found"})
    }

    return res.status(200).json(users);
}

export async function updateUser(req,res){
    let updateData = req.body;

    // Mise à jour des informations de l'utilisateur en fonction de l'id
    if(req.body){
        const result = await UserModel.updateOne({ _id: ObjectId(userId) }, { $set: updateData });
    }

    return res.status(200).json({"message" : "Update effectuée"});
}


export async function randomUser(req, res){
    const excludeEmail = req.session.token ? jwt.verify(req.session.token, process.env.JWT_SECRET).email : null;
    const user = await UserModel.aggregate([
        { $match: { email: { $ne: excludeEmail } } },
        { $sample: { size: 1 } }
    ]);

    return res.status(200).json(user[0]);
}

export async function addUser(req, res){
    const isValidated = await validateUser(req, res);
    if (!isValidated) return;

    const result = await UserModel.insertMany({firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: hashPassword(req.body.password)});

    if (!result)
        return res.status(500).send({"message" : "Error while registering"});
    return res.status(200).ajson({"message" : "User created"});
}