import {UserModel} from "../models/user.js";
import {registerForm} from "../views/registerForm.js";

export async function validateUser(req, res){
    let errors = [];
    if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname || !req.body.password_confirmation)
        errors.push({ msg: 'Certains champs sont vides' });

    const user = await UserModel.findOne({email: req.body.email });
    if (user)
        errors.push({ msg: 'Cet email est déjà utilisé' });

    if (req.body.password !== req.body.password_confirmation)
        errors.push({ msg: 'Les mots de passe ne correspondent pas' });

    if (errors.length > 0){
        res.send(registerForm(errors));
        return false;
    }
    return true;
}

