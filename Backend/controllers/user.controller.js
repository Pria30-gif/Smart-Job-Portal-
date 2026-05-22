import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

<<<<<<< HEAD
// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
=======
// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const file = req.file;

    if (!fullname || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields including profile image are required", success: false });
    }

    if (!file) {
      return res.status(400).json({ message: "Profile image is required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists", success: false });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
<<<<<<< HEAD
      profile: {
        profilePhoto: cloudResponse.secure_url,
        bio: "",
        skills: [],
        resumes: [],
      },
=======
      profile: { profilePhoto: cloudResponse.secure_url },
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    });

    await newUser.save();

    return res.status(201).json({
      message: `Account created successfully for ${fullname}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
<<<<<<< HEAD
    res.status(500).json({
      message: "Server Error registering user",
      success: false,
    });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: "You don't have the necessary role to access this resource",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: sanitizedUser,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error login failed",
      success: false,
    });
  }
};

// ✅ LOGOUT
=======
    return res.status(500).json({ message: "Server error registering user", success: false });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Login request body:", req.body);

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Incorrect email or password", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect email or password", success: false });

    // Case-insensitive role check
    if (user.role.toLowerCase() !== role.toLowerCase())
      return res.status(403).json({ message: "You don't have permission for this role", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    }).json({
      message: `Welcome back ${user.fullname}`,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error logging in", success: false });
  }
};


// ================= LOGOUT =================
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
<<<<<<< HEAD
    res.status(500).json({
      message: "Server Error logging out",
      success: false,
    });
  }
};

// ✅ UPDATE BIO
export const updateBio = async (req, res) => {
  try {
    const userId = req.id;
    const { bio } = req.body;

    if (!bio && bio !== "") {
      return res.status(400).json({
        success: false,
        message: "Bio is required",
      });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    user.profile.bio = bio;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      bio: user.profile.bio,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Bio update failed",
    });
  }
};

// ✅ UPDATE PROFILE
=======
    return res.status(500).json({ message: "Server error logging out", success: false });
  }
};

// ================= UPDATE PROFILE =================
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, bio, skills } = req.body;
    const file = req.file;

<<<<<<< HEAD
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
=======
    const userId = req.id; // Set by authentication middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    if (file) {
<<<<<<< HEAD
      const filePath = `/uploads/${file.filename}`;
      user.profile.resumes.push({
        url: filePath,
        originalName: file.originalname,
      });
=======
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    }

    await user.save();

<<<<<<< HEAD
    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error updating profile",
      success: false,
    });
  }
};

// ✅ REMOVE RESUME
export const removeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.profile.resumes = user.profile.resumes.filter(
      (r) => r._id.toString() !== resumeId
    );

    await user.save();

    return res.status(200).json({
      message: "Resume removed successfully",
=======
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      success: true,
    });
  } catch (error) {
    console.error(error);
<<<<<<< HEAD
    res.status(500).json({
      message: "Server Error removing resume",
      success: false,
    });
=======
    return res.status(500).json({ message: "Server error updating profile", success: false });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  }
};
