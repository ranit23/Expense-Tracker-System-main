import { signUp,login, getUserData, deleteUser } from "../controllers/user.js";
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";

const userRoute = Router();

userRoute.route("/signup").post(signUp)
userRoute.route("/login").post(login)
userRoute.route("/me").get(authenticateToken, getUserData)
userRoute.route("/delete").delete(authenticateToken, deleteUser)

export default userRoute;