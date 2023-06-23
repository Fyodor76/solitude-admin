import Router from "express";
import {login, register} from "../controllers/auth.js";
import {validateUser} from "../validation/authValidation.js";
const router = new Router()


router.post('/registration', validateUser, /*upload.single('picture'),*/ register)
router.post('/login', login)

export default router;