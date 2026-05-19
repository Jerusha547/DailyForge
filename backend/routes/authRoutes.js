import express from "express";
import { getUser, login, signup, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
// router object for auth
export const authRouter = express.Router();

// Route for signup
authRouter.post("/signup", signup);

// Route for login
authRouter.post("/login", login);

// Route for get user (me)
authRouter.get("/me", authMiddleware, getUser);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password/:token", resetPassword);
// Route for logout
authRouter.post("/logout", logout);
