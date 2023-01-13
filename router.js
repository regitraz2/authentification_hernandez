import { Router} from "express";
import {getLoginForm, getRegisterForm, login, register, logout} from "./controllers/AuthController.js";
import {dashboard} from "./controllers/IdkController.js";
import {logged} from "./middleware.js";

const router = Router();

router.get('/', getLoginForm);
router.post('/login', login);
router.get('/register', getRegisterForm);
router.post('/register', register);

router.use(logged); // A partir d'ici toutes les routes sont protégées

router.get('/logout', logout);
router.get('/dashboard', dashboard);

export default router;