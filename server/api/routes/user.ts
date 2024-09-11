import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../errors";
import { upload } from "../middleware/upload";
import { put } from "@vercel/blob";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }
    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ type: UserErrors.EMAIL_ALREADY_EXISTS });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

// router.post("/login", async (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   try {
//     const user: IUser = await UserModel.findOne({ username });

//     if (!user) {
//       return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
//     }

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET_KEY as string,
//       { expiresIn: "1d" }
//     );

//     res.cookie("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Secure should be true in production
//       sameSite: "none", // Set SameSite to None
//       maxAge: 86400000,
//     });

//     res.status(200).json({ userId: user._id });
//   } catch (err) {
//     res.status(500).json({ type: err });
//   }
// });

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user: IUser = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({ userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ type: "SERVER_ERROR", error: err.message });
  }
});

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// router.post("/logout", verifyToken, (req: Request, res: Response) => {
//   res.cookie("auth_token", "", {
//     httpOnly: true,  // Same as when you set the cookie
//     secure: process.env.NODE_ENV === "production", // Use secure in production
//     // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for production, "lax" for development
//     expires: new Date(0), // Set cookie to expire immediately
//   });
//   res.status(200).send({ message: "logged out" });
// });

router.post("/logout", verifyToken, (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0),
  });
  res.status(200).send({ message: "logged out" });
});

router.get(
  "/available-money",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ type: "NO_USER_FOUND" });
      }

      // Return the available money
      return res.json({ availableMoney: user.availableMoney });
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
);

router.get(
  "/profileImage",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }
      res.json({ profileImage: user.profileImage });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

router.post(
  "/uploadProfileImage",
  verifyToken,
  upload.single("profileImage"),
  async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Store the relative path to the file
      user.profileImage = `/uploads/${req.file?.filename}`;
      // user.profileImage = `${req.file?.filename}`;
      await user.save();

      res.json({
        message: "Profile image uploaded successfully",
        profileImage: user.profileImage,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.post("/blobUpload", async (req: Request, res: Response) => {
  try {
    const filename = Array.isArray(req.query.filename)
      ? req.query.filename[0]
      : req.query.filename;

    if (typeof filename !== "string") {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const blob = await put(filename, req, {
      access: "public",
    });

    res.status(200).json(blob);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

router.post("/imageurl", verifyToken, async (req: Request, res: Response) => {
  const { url } = req.body; // Destructure URL from request body
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ type: "NO_USER_FOUND" });
    }

    user.profileImageUrl = url; // Set the URL to the user's profileImageUrl
    await user.save();
    res.status(200).json({ message: "Profile image URL updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Return error message for debugging
  }
});

router.get("/imageurl", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ type: "NO_USER_FOUND" });
    }
    res.json({ profileImageUrl: user.profileImageUrl });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/email", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ type: "NO_USER_FOUND" });
    }
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post(
  "/change-password",
  verifyToken,
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    try {
      // Fetch user from database
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect!" });
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export { router as userRouter };
