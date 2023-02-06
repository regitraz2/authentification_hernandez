import express from "express";
import {getLoginForm, getRegisterForm, login, register, logout, randomUser,getUser} from "./controllers/AuthController.js";
import {logged} from "./middleware.js";

const router = express.Router();

router.post('/login', login);
// router.get('/register', getRegisterForm);
// router.post('/register', register);

 // A partir d'ici toutes les routes sont protégées

router.get('/randomUser',logged,randomUser);

router.get('/users',getUser);

router.get('/logout', logout);
// router.get('/dashboard', dashboard);

export default router;