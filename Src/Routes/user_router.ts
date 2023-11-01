import { Router } from "express";
import { validate } from "../Validators/validate";
import { registerUser } from "../Controllers/user.controller";
const RouterI = Router();

RouterI.route("/register").post(validate, registerUser);
// router.route("/login").post(userLoginValidator(), validate, loginUser);
// router.route("/refresh-token").post(refreshAccessToken);
export default RouterI;
