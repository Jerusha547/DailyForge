import nodemailer from "nodemailer";
import User from "../src/models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// sign up function
export const signup = async (req, res) => {
  try {
    // fetch values from request
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long, include an uppercase letter, a digit, and a special character" });
    }

    // check user exists or not
    const checkExisting = await User.findOne({ email });
    if (checkExisting) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // save the new user in database
    await newUser.save();

    // generate token using jwt
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    
    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "User registered successfully" });
  } catch (error) {
    // error handling
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// login function
export const login = async (req, res) => {
  try {
    // fetch user data from request
    const { email, password } = req.body;

    // check if email and password exist in request
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // // check if user exists or not
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(409).json({ message: "User does not exist" });
    // }

    // // check password using bcrypt
    // const passwordCheck = await bcrypt.compare(password, user.password);
    // if (!passwordCheck) {
    //   return res.status(401).json({ message: "Password does not match" });
    // }

    // check if user exists or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist. Please sign up first.",
      });
    }

    // check password using bcrypt
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    // generate jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (error) {
    // error handling
    console.log("Login error: ", error);
    // return res.status(500).json({ message: "Server error during login" });
    return res
      .status(500)
      .json({ message: "Login failed. Please check your credentials." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    // get email
    const { email } = req.body;

    // find user
    const user = await User.findOne({ email });

    // check user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // save token in database
    user.resetPasswordToken = resetToken;

    // token expiry (15 mins)
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // frontend reset link
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetURL}`,
    });

    return res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.log("Forgot password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // get token from params
    const { token } = req.params;

    // get new password
    const { password } = req.body;

    // find matching user
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    // invalid token
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    user.password = hashedPassword;

    // remove token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Reset password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// access user details function
export const getUser = async (req, res) => {
  try {
    // fetch user data from request
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user: user });
  } catch (_error) {
    // error handling
    return res
      .status(500)
      .json({ message: "Error fetching user data", success: false });
  }
};

// logout function
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful" });
};
