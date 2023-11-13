import { Router } from "express";
import { validate } from "../Validators/validate";
import { registerUser } from "../Controllers/user.controller";
const router = Router();

router.route("/register").post(validate, registerUser);

export default router;
