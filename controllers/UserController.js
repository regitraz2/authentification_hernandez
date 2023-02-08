import {UserModel} from "../models/user.js";
import jwt from "jsonwebtoken";
import {hashPassword} from "../utils/utils.js";

export async function getUser(req,res){
    const users = await UserModel.find({});
    if(!users){
        return res.status(404).json({"message":"User not found"})
    }

    return res.status(200).json(users);
}

export async function updateUser(req,res){
    if (!req.authUser.isAdmin && req.authUser.email !== req.body.email) return res.json({"message":"You are not admin"});

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

    return res.json(user[0]);
}
export async function deleteUser(req, res){
    await UserModel.deleteOne({ _id: req.body.id });
}

export async function addUser(req, res){
    console.log(req.authUser);
    if (!req.authUser.isAdmin) return res.json({"message":"You are not admin"});

    const result = await UserModel.insertMany(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            country: req.body.country,
            city: req.body.city,
            category: req.body.category,
            gender: req.body.gender,
            phone: req.body.phone,
            photo: req.body.photo,
            birthdate: req.body.birthdate,
            isAdmin: req.body.isAdmin === '1',
            password: hashPassword(req.body.password)
        });

    if (!result)
        return res.status(500).send({"message" : "Error while registering"});
    return res.status(200).json({"message" : "User created"});
}