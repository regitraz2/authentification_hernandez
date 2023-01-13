import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
});

export const UserModel = model("User", UserSchema);