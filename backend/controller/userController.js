import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

// @desc    Register a new user (Email/Password)
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Auth user & get token (Email/Password)
// @route   POST /api/users/signin
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Google Auth (Login/Signup)
// @route   POST /api/users/google-auth
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ googleId });

    if (!user) {
        // Check if user exists with same email
        user = await User.findOne({ email });
        if (user) {
            user.googleId = googleId;
            await user.save();
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                avatar: { url: picture },
                isVerified: true,
            });
        }
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

// @desc    Send OTP via WhatsApp
// @route   POST /api/users/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400);
        throw new Error("Phone number is required");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user = await User.findOne({ phone });

    if (!user) {
        user = await User.create({
            name: "User", // Placeholder name
            phone,
            otp,
            otpExpire,
        });
    } else {
        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
    }

    // Mock WhatsApp Sending Logic
    console.log(`Sending OTP ${otp} to ${phone} via WhatsApp...`);
    // In a real scenario, you would use an API like Twilio or Meta

    res.json({ message: "OTP sent successfully" });
});

// @desc    Verify OTP & Login/Signup
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
        res.status(400);
        throw new Error("Invalid or expired OTP");
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
    });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            addresses: user.addresses,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.body.addresses) {
            user.addresses = req.body.addresses;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            addresses: updatedUser.addresses,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export { registerUser, loginUser, googleAuth, sendOTP, verifyOTP, getUserProfile, updateUserProfile };
